# use-item-size

React hook for react-window VariableSizeList

## Usage

```jsx
import React from "react";
import { VariableSizeList as List } from "react-window";
import useForceUpdate from "use-force-update";

const MyList = () => {
  const data = []; // your collection of items

  const renderItem = ({ index, measuring, style }) => (
    <div style={style}>{data[index]}</div>
  );

  const refresh = useForceUpdate();

  const itemSize = useItemSize({
    id: "list",
    data,
    children: renderItem,
    width: 300, // optional width of container
    refresh,
  });

  const otherListProps = {};

  return (
    <List itemSize={itemSize} {...otherListProps}>
      {renderItem}
    </List>
  );
};
```
