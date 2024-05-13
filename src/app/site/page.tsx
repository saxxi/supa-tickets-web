export default async function Home() {
  return (
    <>
      <section className="h-full w-full md:pt-44 mt-[-70px] relative flex items-center justify-center flex-col ">
        <div className="absolute inset-0 bg-fuchsia-400 bg-[size:20px_20px] opacity-20 blur-[100px]"></div>

        <p className="text-center">First text here</p>

        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-8xl font-bold text-center md:text-[100px]">
            Another Text Here
          </h1>
        </div>
      </section>
    </>
  );
}
