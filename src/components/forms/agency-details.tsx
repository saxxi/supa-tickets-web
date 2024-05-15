"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Agency } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loading from "@/components/global/loading";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import FileUpload from "@/components/global/file-upload";
import { deleteAgency, initUser, upsertAgency } from "@/lib/queries";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";

type Props = {
  data?: Partial<Agency>;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Please fill in this field" }),
  companyEmail: z.string().min(1, { message: "Please fill in this field" }),
  companyPhone: z.string().min(1, { message: "Please fill in this field" }),
  address: z.string().min(1, { message: "Please fill in this field" }),
  city: z.string().min(1, { message: "Please fill in this field" }),
  zipCode: z.string().min(1, { message: "Please fill in this field" }),
  state: z.string().min(1, { message: "Please fill in this field" }),
  country: z.string().min(1, { message: "Please fill in this field" }),
  agencyLogo: z.string(),
});

function PageWrap({
  deletingAgency,
  handleDeleteAgency,
  children,
}: {
  deletingAgency: boolean;
  handleDeleteAgency: () => void;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>
            Edit the details of your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}

          <hr className="my-5" />

          <DeleteAgency
            disabled={deletingAgency}
            onConfirm={handleDeleteAgency}
          />
        </CardContent>
      </Card>
    </AlertDialog>
  );
}

function DeleteAgency({
  disabled,
  onConfirm,
}: {
  disabled: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={disabled} variant="outline">
          {disabled && <Loading />}
          Delete agency
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function AgencyDetails({ data }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      companyEmail: "",
      companyPhone: "",
      address: "",
      city: "",
      zipCode: "",
      state: "",
      country: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        name: "",
        companyEmail: "",
        companyPhone: "",
        address: "",
        city: "",
        zipCode: "",
        state: "",
        country: "",
        agencyLogo: "",
        ...data,
      });
    }
  }, [data]);

  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    setDeletingAgency(true);

    try {
      await deleteAgency(data.id);
      toast({
        title: "Deleted Agency",
        description: "Deleted your agency and all subaccounts",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Ops!",
        description: "could not delete your agency ",
      });
    }
    setDeletingAgency(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let newUserData;
      let custId;
      if (!data?.id) {
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.zipCode,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.zipCode,
          },
        };

        const customerResponse = await fetch("/api/stripe/create-customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        });
        const customerData: { customerId: string } =
          await customerResponse.json();
        custId = customerData.customerId;
      }

      newUserData = await initUser({ role: "AGENCY_OWNER" });
      if (!data?.customerId && !custId) return;

      const response = await upsertAgency({
        id: data?.id ? data.id : v4(),
        customerId: data?.customerId || custId || "",
        address: values.address,
        agencyLogo: values.agencyLogo,
        city: values.city,
        companyPhone: values.companyPhone,
        country: values.country,
        name: values.name,
        state: values.state,
        zipCode: values.zipCode,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyEmail: values.companyEmail,
        connectAccountId: "",
        goal: 5,
      });
      console.log("RESPONSE", response);

      toast({
        title: "Created Agency",
      });
      if (data?.id) return router.refresh();
      if (response) {
        return router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "could not create your agency",
      });
    }
  };

  return (
    <PageWrap
      deletingAgency={deletingAgency}
      handleDeleteAgency={handleDeleteAgency}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={isLoading} className="space-y-8">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="agencyLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="agencyLogo"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex md:flex-row gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Agency Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your agency name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Agency Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex md:flex-row gap-4">
              <FormField
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Agency Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 st..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex md:flex-row gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Zipcpde</FormLabel>
                    <FormControl>
                      <Input placeholder="Zipcode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </fieldset>
        </form>
      </Form>
    </PageWrap>
  );
}
