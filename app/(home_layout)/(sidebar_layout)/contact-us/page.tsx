import AddHandler from '@/app/components/contactus/addresshandler';
import { ContactForm } from '@/app/components/contactus/contactForm';
import { apiRequest } from '@/lib/apiClient';

async function getData() {
  const res = await apiRequest('contact', { next: { revalidate: 86400, tags: ['contact-us'] } });
  return res;
}

export async function generateMetadata() {
  const data = await getData();

  return {
    title: data?.page_title || 'Contact Us',
    description: data?.meta_description || 'Contact Aeromagasia',
    keywords: data?.meta_keyword || 'Contact Aeromagasia, Aeromagasia, Contact Us',
  };
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="space-y-3">
      <h1 className="heading font-bold text-primary">Contact Us</h1>
      <p className="text-justify content">
        Have questions or feedback? We&apos;d love to hear from you!
      </p>
      <div className="mt-5 space-y-8">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ContactForm />
        </div>

        <AddHandler addresses={data.contact_info} />
      </div>
    </div>
  );
}
