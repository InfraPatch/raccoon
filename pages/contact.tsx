import Meta from '@/components/common/Meta';
import ContentPageLayout from '@/layouts/ContentPageLayout';

import Illustration from '@/components/common/illustrations/Illustration';
import ContactForm from '@/components/contact-form/ContactForm';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

const ContactPage = () => {
  const { t } = useTranslation('contact');

  return (
    <ContentPageLayout title={ t('title') } subtitle={ t('subtitle') }>
      <Meta
        title={ t('title') }
        description={ t('description') }
        url="/contact"
      />

      <Illustration.Contact className="max-w-lg mx-auto mb-10" />

      <div className="max-w-lg mx-auto">
        <ContactForm />
      </div>
    </ContentPageLayout>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...await serverSideTranslations(locale, [ 'common', 'contact', 'errors' ])
    }
  };
};

export default ContactPage;
