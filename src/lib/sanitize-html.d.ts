declare module "sanitize-html" {
  function sanitizeHtml(dirty: string, options?: sanitizeHtml.IOptions): string;

  namespace sanitizeHtml {
    interface IOptions {
      allowedTags?: string[] | null;
      allowedAttributes?: Record<string, string[]>;
      allowedSchemes?: string[];
      allowedSchemesByTag?: Record<string, string[]>;
      allowProtocolRelative?: boolean;
      transformTags?: Record<string, unknown>;
      [key: string]: unknown;
    }

    function simpleTransform(
      tagName: string,
      attribs: Record<string, string>,
      open?: boolean,
    ): unknown;
  }

  export = sanitizeHtml;
}
