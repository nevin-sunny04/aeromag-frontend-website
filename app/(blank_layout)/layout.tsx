import Header from '../components/subscription/header';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="overflow-hidden">
      <Header title={'Magazine Subscription'} />
      <div className="min-h-[calc(100vh-74px)]   justify-center flex  py-10 items-center">
        {children}
      </div>
    </div>
  );
}
