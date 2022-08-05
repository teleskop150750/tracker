import { AppLayoutToFileMap } from "../../layouts/layouts";

export async function loadLayout(route) {
  const { layout } = route.meta;
  const normalizedLayoutName = layout || "default";
  const fileName = AppLayoutToFileMap[normalizedLayoutName];
  const fileNameWithoutExtension = fileName.split(".vue")[0];

  const component = await import(
    `../../layouts/${fileNameWithoutExtension}.vue`
  );
  route.meta.layoutComponent = component.default;
}
