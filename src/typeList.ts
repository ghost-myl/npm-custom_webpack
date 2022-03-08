/**
 * 导航菜单列表接口
 */
export interface MenuListType {
  path: string;
  icon: React.ReactElement;
  name: string;
  children?: Array<MenuListType>;
}
