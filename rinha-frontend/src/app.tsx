import { useEffect, useRef, useState } from "preact/hooks";
import "./app.css";
import { isArray, isJSPrimitive } from "./helper";
import React from "preact/compat";
import JsonTree from "./components/JsonTree/JsonTree";

export function App() {
  const treeViewRef = useRef<HTMLDivElement>(null);

  const [json, setJson] = useState<any>(null);
  const [pagedJson, setPagedJson] = useState<any>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [error, setError] = useState<string>("");

  useEffect(() => {
    treeViewRef.current!.addEventListener("scroll", handleInfiniteScroll);
    return () =>
      treeViewRef.current!.removeEventListener("scroll", handleInfiniteScroll);
  }, [loading]);

  function handleInfiniteScroll() {
    const treeViewContainer = treeViewRef.current;
    if (!treeViewContainer) return;
    setLoading(true);

    const newPage = page + 1;
    const isScrolledToBottom =
      treeViewContainer.scrollHeight - treeViewContainer.scrollTop ===
      treeViewContainer.clientHeight;

    if (isScrolledToBottom) {
      const newPagedJson = json.slice(
        itemsPerPage * page,
        itemsPerPage * newPage
      );

      setPagedJson((prevPagedJson: any) => [...prevPagedJson, ...newPagedJson]);
      setPage((prevState: number) => prevState + 1);
      setLoading(false);
    }
  }

  //Le o arquivo uploadado e transforma ele em JSON
  function handleFile(event: any) {
    setPage(1);
    setPagedJson(null);
    setError("");
    setLoading(true);
    const reader = new FileReader();
    const uploadedFile = event.target.files[0];
    const extension = uploadedFile.name.split(".").pop();
    if (extension != "json") {
      setLoading(false);
      setError("Invalid file. Please load a valid JSON file.");
      return;
    }
    reader.readAsText(uploadedFile);
    reader.onload = function (evt) {
      if (evt.target!.result) {
        let json = JSON.parse((evt.target?.result as string) ?? "");
        setJson(json);
        if (isArray(json)) {
          setPagedJson(json.slice(0, itemsPerPage));
        } else setPagedJson(json);
      }
      setLoading(false);
    };
  }

  return (
    <div className="container">
      <h1>JSON Tree Viewer</h1>
      <h3>
        Simple JSON Tree Viewer that run completely on-client. No data exchange.
      </h3>
      <input type="file" accept="application/json" onChange={handleFile} />
      {error && <p class="error">{error}</p>}
      {pagedJson && (
        <>
          <div className="container__pageInfo">
            <span>Page: {page}</span>
            <span>Items per page: {itemsPerPage}</span>
          </div>

          <input
            min={10}
            max={100}
            value={itemsPerPage}
            onChange={(e: any) => {
              setLoading(true);
              setItemsPerPage(e.target!.value);
              setLoading(false);
            }}
            type="range"
          />
        </>
      )}
      <JsonTree pagedJson={pagedJson} ref={treeViewRef} error={error} />
    </div>
  );
}
