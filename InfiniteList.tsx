import React from "react"

type InfiniteScrollProps<T> = {
  loadMoreFunc: () => Promise<T[]>
  mappingFunc: (vals: any[]) => JSX.Element[]
  values: T[]
  direction: "row" | "row-reverse" | "column" | "column-reverse"
  pageSize: number
  noDupes?: boolean
}
 
function InfiniteList(props: InfiniteScrollProps<any>): JSX.Element {
  const [values, setValues] = React.useState<any[]>([])
  const [error, setError] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true) 
  const observer = React.useRef<IntersectionObserver>()
  const lastValueRef = React.useCallback(
    (node) => { 
      if (observer.current) observer.current!.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) { 
          props.loadMoreFunc()
            .then((res) => {
              if(res.length>0) setValues((prev) => [...prev, ...res]) 
              setHasMore(!(res.length < props.pageSize)) 
            })
            .catch((err) => {
              setError(err)
            })
        }
      })
      if (node) observer.current!.observe(node)
    }, 
    [hasMore, props.loadMoreFunc]
  )
  const memoizedChildren = React.useMemo(() => {
    let conCatArr = [...props.values, ...values] //concat the old values with the loaded ones 
    if (props.noDupes) conCatArr = reduceDupes(conCatArr)
    let mappedVals = props.mappingFunc(conCatArr)
    return mappedVals.map((child, i) => {
      if (i === mappedVals.length - 1)
        return (
          <div key={i} ref={lastValueRef}>
            {" "}
            {child}{" "}
          </div>
        )
      else return <div key={i}>{child}</div>
    }) 
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, props.values, props.mappingFunc])
  return (
    <div style={{ display: "flex", flexDirection: props.direction }}>
      {memoizedChildren}
      <div>{error ? "Error..." : !hasMore ? "No more items." : ""}</div>
    </div>
  )
} 
//exported for testing
export function reduceDupes<T>(arr: T[]) {
  return arr.reduce((r: T[], i) => (!r.some((j) => JSON.stringify(i) === JSON.stringify(j)) ? [...r, i] : [...r]), [])
} 
export default React.memo(InfiniteList)