export interface TabItem
{
    Component: React.FC,
    title: string
}

export interface TabProps
{
    _tabs: TabItem[]
}