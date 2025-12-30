export const localizeConditions = (
  locale: string,
  data: any,
  ...fields: string[]
) => {
  let { ...conditions } = data;
  for (let i = 0; i < fields.length; i++) {
    if (conditions[fields[i]!]) {
      let v = conditions[fields[i]!];
      delete conditions[fields[i]!];
      conditions[`${fields[i]!}.${locale}`] = v;
    }
  }
  return conditions;
};

export function applyLocalization(data: any, lang: string = "en"): any {
  if (Array.isArray(data)) {
    return data.map((item) => applyLocalization(item, lang));
  }

  if (data !== null && typeof data === "object") {
    const obj = data.toJSON ? data.toJSON({ lang }) : { ...data };

    for (const key in obj) {
      const value = obj[key];

      if (
        value &&
        typeof value === "object" &&
        ("en" in value || "ar" in value)
      ) {
        const displayKey = `${key}Display`; 
        obj[displayKey] = value[lang] || value["en"];
      } 
      else if (typeof value === "object" && value !== null) {
        obj[key] = applyLocalization(value, lang);
      }
    }
    return obj;
  }

  return data;
}