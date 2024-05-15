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

type Props = {
  data?: Partial<Agency>;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Please fill in this field" }),
  companyEmail: z.string().min(1, { message: "Please fill in this field" }),
  companyPhone: z.string().min(1, { message: "Please fill in this field" }),
  whiteLabel: z.boolean(),
  address: z.string().min(1, { message: "Please fill in this field" }),
  city: z.string().min(1, { message: "Please fill in this field" }),
  zipCode: z.string().min(1, { message: "Please fill in this field" }),
  state: z.string().min(1, { message: "Please fill in this field" }),
  country: z.string().min(1, { message: "Please fill in this field" }),
  agencyLogo: z.string(),
});

function PageWrap({
  form,
  deletingAgency,
  handleDeleteAgency,
  children,
}: {
  form: ReturnType<typeof useForm>;
  deletingAgency: boolean;
  handleDeleteAgency: () => void;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <Card>
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>
            Lets create an agency for you business. You can edit agency settings
            later from the agency settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}

          <hr className="my-10" />

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
  const [deletingAgency, setDeletingAgency] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      companyEmail: "",
      companyPhone: "",
      whiteLabel: false,
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
        whiteLabel: false,
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
    setDeletingAgency(true);

    setTimeout(() => {
      toast({
        title: "Deleted Agency",
        description: "Deleted your agency and all subaccounts",
      });
      window.location.reload();
    }, 1000);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("submitted", values);
  }

  console.log("for", JSON.stringify(form.formState.errors));

  return (
    <PageWrap
      form={form}
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
                  <FormLabel>Agency Logo</FormLabel>
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
              name="whiteLabel"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                    <div>
                      <FormLabel>Whitelabel Agency</FormLabel>
                      <FormDescription>
                        Turning on whilelabel mode will show your agency logo to
                        all sub accounts by default. You can overwrite this
                        functionality through sub account settings.
                      </FormDescription>
                    </div>

                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
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
