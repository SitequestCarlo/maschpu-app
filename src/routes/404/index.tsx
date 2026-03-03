import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="error-page">
      <div class="error-content">
        {/* 404 Number */}
        <h1>404</h1>

        {/* Message */}
        <div class="error-message">
          <h2>Seite nicht gefunden</h2>
          <p>
            Die gesuchte Seite existiert leider nicht oder wurde verschoben.
          </p>

          {/* Back to Home Button */}
          <div class="error-actions">
            <Link href="/" class="btn btn-primary">
              <svg
                class="icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Zur Startseite
            </Link>
            <Link href="/pumpen" class="btn btn-secondary">
              Pumpen ansehen
            </Link>
          </div>
        </div>
      </div>

      <style>
        {`
          .error-page {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            text-align: center;
            padding: 2rem;
          }

          .error-content h1 {
            font-size: clamp(8rem, 20vw, 15rem);
            font-weight: 700;
            color: rgba(0, 0, 0, 0.1);
            margin: 0;
            line-height: 1;
            user-select: none;
          }

          .error-message {
            margin-top: -3rem;
          }

          .error-message h2 {
            font-size: clamp(1.5rem, 4vw, 2.5rem);
            font-weight: 700;
            color: var(--text-primary, #333);
            margin: 0 0 1rem;
          }

          .error-message p {
            color: var(--text-secondary, #666);
            margin-bottom: 2rem;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
            font-size: 1.1rem;
          }

          .error-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }

          .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .btn .icon {
            width: 1.25rem;
            height: 1.25rem;
          }

          .btn-primary {
            background: var(--primary, #0066cc);
            color: white;
          }

          .btn-primary:hover {
            background: var(--primary-dark, #0052a3);
          }

          .btn-secondary {
            background: var(--surface, #f5f5f5);
            color: var(--text-primary, #333);
            border: 1px solid var(--border, #ddd);
          }

          .btn-secondary:hover {
            background: var(--surface-hover, #e8e8e8);
          }

          @media (max-width: 480px) {
            .error-actions {
              flex-direction: column;
            }

            .btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}
      </style>
    </div>
  );
});

export const head: DocumentHead = {
  title: "404 - Seite nicht gefunden | MaschPu",
  meta: [
    {
      name: "description",
      content: "Die gesuchte Seite wurde nicht gefunden.",
    },
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ],
};
