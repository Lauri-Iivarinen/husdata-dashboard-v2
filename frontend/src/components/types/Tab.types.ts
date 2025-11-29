import { PageProps } from "../../util/types/PageProps";

export interface TabItem
{
    Component: React.FC<PageProps>,
    title: string
}

export interface TabProps
{
    _tabs: TabItem[]
}