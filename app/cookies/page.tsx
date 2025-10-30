"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">Política de Cookies</h1>

        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">¿Qué son las cookies?</h2>
            <p>
              Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. Las
              cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos
              de navegación de un usuario o de su equipo y, dependiendo de la información que contengan y de la forma en
              que utilice su equipo, pueden utilizarse para reconocer al usuario.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">¿Qué tipos de cookies utiliza esta página web?</h2>
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Cookies técnicas</h3>
            <p>
              Son aquellas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y
              la utilización de las diferentes opciones o servicios que en ella existan.
            </p>
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Cookies de análisis</h3>
            <p>
              Son aquellas que permiten al responsable de las mismas, el seguimiento y análisis del comportamiento de
              los usuarios de los sitios web a los que están vinculadas. La información recogida mediante este tipo de
              cookies se utiliza en la medición de la actividad de los sitios web, aplicación o plataforma y para la
              elaboración de perfiles de navegación de los usuarios de dichos sitios.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Cookies de terceros</h2>
            <p>
              Esta página web puede utilizar servicios de terceros que, por cuenta de nordrive, recopilarán información
              con fines estadísticos y de uso del portal por parte del usuario.
            </p>
            <p className="mt-4">En particular, este sitio web utiliza:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong>Google Analytics:</strong> Herramienta de análisis que ayuda a los sitios web y a los
                propietarios de aplicaciones a entender el modo en que sus visitantes interactúan con sus propiedades.
                Puede consultar más información sobre las cookies de Google Analytics en: {" "}
                <a
                  href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage
                </a>
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">¿Cómo puedo desactivar las cookies?</h2>
            <p>
              Puede usted permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de
              las opciones del navegador instalado en su ordenador:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong>Chrome:</strong> {" "}
                <a
                  href="https://support.google.com/chrome/answer/95647?hl=es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Configuración de cookies en Chrome
                </a>
              </li>
              <li>
                <strong>Firefox:</strong> {" "}
                <a
                  href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Configuración de cookies en Firefox
                </a>
              </li>
              <li>
                <strong>Safari:</strong> {" "}
                <a
                  href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Configuración de cookies en Safari
                </a>
              </li>
              <li>
                <strong>Edge:</strong> {" "}
                <a
                  href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Configuración de cookies en Edge
                </a>
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Actualización de la Política de Cookies</h2>
            <p>
              nordrive puede modificar esta Política de Cookies en función de exigencias legislativas, reglamentarias, o
              con la finalidad de adaptar dicha política a las instrucciones dictadas por la Agencia Española de
              Protección de Datos.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Última actualización: {new Date().toLocaleDateString("es-ES")}
          </p>
        </div>
      </div>
    </div>
  )
}
