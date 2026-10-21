<?xml version="1.0" encoding="UTF-8"?>
<!--
  Ojo: en los atributos de esta hoja las llaves { } son expresiones XSLT; para escribir una llave literal usa {{ o }}.
  Hoja de estilo del feed RSS del blog (/blog/rss.xml). Solo cambia cómo lo ve una persona en el
  navegador; los lectores de RSS ignoran esta hoja y leen el RSS 2.0 tal cual.
  Las rutas son relativas (../Logo.png, ./) para que funcionen también con basePath.
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:dc="http://purl.org/dc/elements/1.1/" exclude-result-prefixes="dc">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat" />

  <xsl:template match="/">
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>Blog del motor · NorDrive — Feed RSS</title>
        <style>
          *{box-sizing:border-box}
          body{margin:0;background:#f8fafc;color:#0f172a;font-family:Poppins,Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;line-height:1.6}
          a{color:#1d4ed8}
          a:focus-visible,button:focus-visible{outline:2px solid #2563eb;outline-offset:2px}
          .wrap{max-width:760px;margin:0 auto;padding:32px 16px 64px}
          .top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:32px}
          .top img{height:36px;width:auto}
          .back{font-size:14px;font-weight:600;text-decoration:none}
          .hero{border-radius:24px;padding:28px;color:#fff;background:radial-gradient(circle at 15% 15%,rgba(96,165,250,.45),transparent 50%),linear-gradient(135deg,#0b1220,#0f2a5f 60%,#1d4ed8)}
          .eyebrow{margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#bfdbfe}
          h1{margin:0;font-size:30px;line-height:1.15;letter-spacing:-.01em}
          .hero p{margin:12px 0 0;color:rgba(255,255,255,.85)}
          .card{margin-top:20px;border:1px solid #e2e8f0;background:#fff;border-radius:20px;padding:22px}
          .card h2{margin:0 0 6px;font-size:18px}
          .card p{margin:0 0 14px;color:#475569;font-size:15px}
          .feed{display:flex;gap:8px;flex-wrap:wrap}
          .feed input{flex:1 1 260px;min-width:0;font:inherit;font-size:14px;padding:10px 14px;border:1px solid #cbd5e1;border-radius:12px;background:#f8fafc;color:#0f172a}
          .btn{display:inline-flex;align-items:center;justify-content:center;font:inherit;font-size:14px;font-weight:600;padding:10px 16px;border-radius:999px;border:0;cursor:pointer;text-decoration:none}
          .btn-dark{background:#0f172a;color:#fff}
          .btn-light{background:#fff;color:#0f172a;border:1px solid #cbd5e1}
          .apps{margin-top:14px;display:flex;gap:8px;flex-wrap:wrap}
          .hint{margin-top:10px;font-size:13px;color:#64748b}
          .list-title{margin:44px 0 14px;font-size:22px;letter-spacing:-.01em}
          ol{list-style:none;margin:0;padding:0}
          li{padding:18px 0;border-top:1px solid #e2e8f0}
          .chip{display:inline-block;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#1d4ed8;background:#eff6ff;border-radius:999px;padding:3px 9px}
          li h3{margin:8px 0 4px;font-size:17px;line-height:1.35}
          li h3 a{color:#0f172a;text-decoration:none}
          li h3 a:hover{color:#1d4ed8;text-decoration:underline}
          li p{margin:0;color:#475569;font-size:14px}
          .date{font-size:12px;color:#64748b;margin-top:6px}
          .empty{color:#64748b}
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="top">
            <a href="../"><img src="../Logo.png" alt="NorDrive" /></a>
            <a class="back" href="./">← Volver al blog</a>
          </div>

          <div class="hero">
            <p class="eyebrow">Feed RSS</p>
            <h1>Blog del motor · NorDrive</h1>
            <p>Esta página es el <strong>feed RSS</strong> del blog: una dirección que los lectores de noticias consultan solos para avisarte cada vez que publicamos un artículo nuevo. Sin registros ni correos.</p>
          </div>

          <div class="card">
            <h2>Cómo suscribirte</h2>
            <p>Copia esta dirección y pégala en tu lector de RSS favorito (Feedly, Inoreader, NetNewsWire, Reeder…), en la opción «Añadir feed» o «Suscribirse».</p>
            <div class="feed">
              <input id="feed-url" type="text" readonly="readonly" value="https://www.nordrivecars.com/blog/rss.xml" aria-label="Dirección del feed RSS" onclick="this.select()" />
              <button type="button" class="btn btn-dark" id="copy-btn" onclick="var i=document.getElementById('feed-url');i.select();var b=this;var ok=function(){{b.textContent='¡Copiado!'}};if(navigator.clipboard){{navigator.clipboard.writeText(i.value).then(ok,function(){{document.execCommand('copy');ok()}})}}else{{document.execCommand('copy');ok()}}">Copiar</button>
            </div>
            <div class="apps">
              <a class="btn btn-light" href="https://feedly.com/i/subscription/feed/https%3A%2F%2Fwww.nordrivecars.com%2Fblog%2Frss.xml" target="_blank" rel="noopener noreferrer">Abrir en Feedly</a>
              <a class="btn btn-light" href="https://www.inoreader.com/?add_feed=https%3A%2F%2Fwww.nordrivecars.com%2Fblog%2Frss.xml" target="_blank" rel="noopener noreferrer">Abrir en Inoreader</a>
            </div>
            <p class="hint">¿No usas un lector de RSS? También puedes visitar el <a href="./">blog</a> cuando quieras.</p>
          </div>

          <h2 class="list-title">Últimos artículos</h2>
          <xsl:choose>
            <xsl:when test="count(/rss/channel/item) &gt; 0">
              <ol>
                <xsl:for-each select="/rss/channel/item[position() &lt;= 30]">
                  <li>
                    <xsl:if test="category[1]">
                      <span class="chip"><xsl:value-of select="category[1]" /></span>
                    </xsl:if>
                    <h3><a href="{link}"><xsl:value-of select="title" /></a></h3>
                    <p><xsl:value-of select="description" /></p>
                    <div class="date"><xsl:call-template name="fecha"><xsl:with-param name="d" select="pubDate" /></xsl:call-template></div>
                  </li>
                </xsl:for-each>
              </ol>
            </xsl:when>
            <xsl:otherwise>
              <p class="empty">Todavía no hay artículos publicados. ¡Suscríbete y te avisaremos del primero!</p>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </body>
    </html>
  </xsl:template>

  <!-- "Mon, 19 Oct 2026 08:00:00 GMT" → "19 de octubre de 2026" -->
  <xsl:template name="fecha">
    <xsl:param name="d" />
    <xsl:variable name="m" select="substring($d, 9, 3)" />
    <xsl:value-of select="number(substring($d, 6, 2))" />
    <xsl:text> de </xsl:text>
    <xsl:choose>
        <xsl:when test="$m = 'Jan'">enero</xsl:when>
        <xsl:when test="$m = 'Feb'">febrero</xsl:when>
        <xsl:when test="$m = 'Mar'">marzo</xsl:when>
        <xsl:when test="$m = 'Apr'">abril</xsl:when>
        <xsl:when test="$m = 'May'">mayo</xsl:when>
        <xsl:when test="$m = 'Jun'">junio</xsl:when>
        <xsl:when test="$m = 'Jul'">julio</xsl:when>
        <xsl:when test="$m = 'Aug'">agosto</xsl:when>
        <xsl:when test="$m = 'Sep'">septiembre</xsl:when>
        <xsl:when test="$m = 'Oct'">octubre</xsl:when>
        <xsl:when test="$m = 'Nov'">noviembre</xsl:when>
        <xsl:when test="$m = 'Dec'">diciembre</xsl:when>
        <xsl:otherwise><xsl:value-of select="$m" /></xsl:otherwise>
    </xsl:choose>
    <xsl:text> de </xsl:text>
    <xsl:value-of select="substring($d, 13, 4)" />
  </xsl:template>
</xsl:stylesheet>
