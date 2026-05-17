import { useEffect, useRef, useState } from "react";

const TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const SCRIPT_ID = "google-recaptcha-v2";
const RECAPTCHA_SRC = "https://www.google.com/recaptcha/api.js?render=explicit";

const getSiteKey = () => {
  return import.meta.env.VITE_RECAPTCHA_SITE_KEY || (import.meta.env.DEV ? TEST_SITE_KEY : "");
};

const loadRecaptchaScript = () => {
  const existingScript = document.getElementById(SCRIPT_ID);

  if (existingScript) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = RECAPTCHA_SRC;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const RecaptchaCheckbox = ({ onVerify, onExpire, resetKey }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const siteKey = getSiteKey();
  const [error, setError] = useState(
    siteKey ? "" : "reCAPTCHA needs a site key before authentication can continue.",
  );

  useEffect(() => {
    let isMounted = true;

    if (!siteKey) {
      return undefined;
    }

    const renderWidget = async () => {
      try {
        await loadRecaptchaScript();

        if (!isMounted || !window.grecaptcha || !containerRef.current) {
          return;
        }

        window.grecaptcha.ready(() => {
          if (!isMounted || !containerRef.current) {
            return;
          }

          if (widgetIdRef.current !== null) {
            window.grecaptcha.reset(widgetIdRef.current);
            onExpire();
            return;
          }

          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            "expired-callback": onExpire,
            "error-callback": () => {
              setError("reCAPTCHA could not be loaded. Please try again.");
              onExpire();
            },
          });
        });
      } catch {
        if (isMounted) {
          setError("reCAPTCHA could not be loaded. Please check your connection.");
          onExpire();
        }
      }
    };

    renderWidget();

    return () => {
      isMounted = false;
    };
  }, [onExpire, onVerify, resetKey, siteKey]);

  return (
    <div className="recaptcha-wrapper">
      <div ref={containerRef} />
      {error && <p role="alert" className="auth-message">{error}</p>}
    </div>
  );
};

export default RecaptchaCheckbox;
