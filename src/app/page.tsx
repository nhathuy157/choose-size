import WizardLayout from './wizard/layout';
import ProductPage from './wizard/page';

export default function Home() {
  return (
    <WizardLayout>
      <ProductPage />
    </WizardLayout>
  );
}
