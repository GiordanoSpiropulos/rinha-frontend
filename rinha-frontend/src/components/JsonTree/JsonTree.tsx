import React from "preact/compat";
import { isArray, isJSPrimitive } from "../../helper";

function getTreeViewClass(object: any) {
  if (isJSPrimitive(object)) return "container__treeView_nested";
  if (isArray(object) && object!.length <= 0)
    return "container__treeView_array-empty";
  if (isArray(object) && object!.length > 0)
    return "container__treeView_array-full";
  return "container__treeView_nested-only";
}

//Renderiza o objeto - folha se for o final da recursividade ou array/objetos para novas recursividades
const renderCondition = (object: any) => {
  if (isJSPrimitive(object)) return buildLeaf(object);
  if (isArray(object)) return loopArray(object);
  return processObject(object);
};

const processObject = (object: any) => {
  if (!object) {
    return buildLeaf(object);
  }
  return Object.keys(object).map((key, index) => {
    return (
      <li key={key + index} className="container__treeView_list-secondary">
        {buildNode(key)}
        {!isJSPrimitive(object[key]) && !isArray(object[key]) && (
          <span className="curly_brackets-open">&#123;</span>
        )}

        <ul className={getTreeViewClass(object[key])}>
          {renderCondition(object[key])}
          {!isJSPrimitive(object[key]) && !isArray(object[key]) && (
            <span className="curly_brackets-close">&#125;</span>
          )}
        </ul>
      </li>
    );
  });
};

//Dá loop no array, se tiver mais objetos ou array, também ativa a recursividade.
const loopArray = (array: any) => {
  return array.map((value: any, key: any) => (
    <div
      key={key}
      className={
        isJSPrimitive(value)
          ? "container__treeView_array"
          : "container__treeView_array-column"
      }
    >
      <span className="container__treeView_array-index">{key}: </span>
      {renderCondition(value)}
    </div>
  ));
};

//Constroi o primeiro nó da árvore
const buildNode = (key: string) => (
  <span
    className="container__treeView_node"
    onClick={(e) => {
      toggle(e);
    }}
  >
    {key}
  </span>
);

//Constrói na tela o ultimo item da árvore
const buildLeaf = (value: any) => (
  <li
    className="container__treeView_leaf"
    onClick={
      // tslint:disable-next-line:no-empty
      () => {
        console.log(value);
      }
    }
  >
    {typeof value == "string" && `\"${value}\"`}
    {value == null && "null"}
    {typeof value !== "string" && `${value}`}
  </li>
);

const toggle = (event: any) => {
  console.log("toggle");
  let a = event.target.parentElement.querySelector(
    ".container__treeView_nested-only"
  );
  if (!a) return;
  a.classList.toggle("active");
  event.target.classList.toggle("node-down");
};
const JsonTree = React.forwardRef((props: JsonTreeProps, ref: any) => (
  <div ref={ref} className="container__treeView">
    {props.pagedJson && !props.error && (
      <>
        {isArray(props.pagedJson) ? (
          props.pagedJson.map((items: any, index: number) => {
            return (
              <>
                <span className="container__treeView_array-index">
                  {index}:
                </span>
                <ul className="container__treeView_list-main">
                  {processObject(items)}
                </ul>
              </>
            );
          })
        ) : (
          <ul className="container__treeView_list-main">
            {processObject(props.pagedJson)}
          </ul>
        )}
      </>
    )}
  </div>
));

export default JsonTree;
