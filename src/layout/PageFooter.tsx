// Core
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Styles
import './PageFooter.scss';

// Component
const PageFooter: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div className="PageFooter">
      <span className="credits">©2019 Hunger Free Oklahoma</span>
      <Link to={t('footer.nondiscriminationLink')}>{t('footer.nondiscriminationStatement')}</Link>
    </div>
  );
};

// Export
export default PageFooter;
