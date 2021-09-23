# simple-infinite-list
A simple infinite loader leveraging a IntersectionObserver and written in React Typescript

Prop | Description | Type
------------ | ------------- | -------------
loadMoreFunc | async function called when the IntersectionObserver is intersecting with the last value | ()=>Promise<T>
mappingFunc | function used to map the values | (vals: any[])=>JSX.Element[]
direction | direction to scroll, a CSS flex-direction | 'row' | 'row-reverse' | 'column' | 'column-reverse'
pageSize | expected length of the array, used to determine whether the upstream has more items to fetch | number
noDupes | whether or not the list will filter for perfectly identical objects | boolean
  
