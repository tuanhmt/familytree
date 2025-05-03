import './index.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import App from './components/App/App';
import common_vi from "./translations/vi/common.json";
i18next.init({
    interpolation: { escapeValue: false },  // React already does escaping
    lng: 'vi',                              // language to use
    resources: {
        vi: {
            common: common_vi
        }
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <I18nextProvider i18n={i18next}>
            <App />
        </I18nextProvider>
    </StrictMode>,
);
