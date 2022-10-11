// import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/bigmap";
import SnapshotList from "src/components/snapshotList";
import { useLocalState } from "src/utils/useLocalState";
import { SnapshotsQuery, SnapshotsQueryVariables } from "src/generated/SnapshotsQuery";
import { useLastData } from "src/utils/useLastData";

const SNAPSHOTS_QUERY = gql`
  query SnapshotsQuery($bounds: BoundsInput!) {
    snapshots(bounds: $bounds) {
      id
      latitude
      longitude
      address
      publicId
      description
    }
  }
`;

type BoundsArray = [[number, number], [number, number]];
const parseBounds = (boundsString: string) => {
  const bounds = JSON.parse(boundsString) as BoundsArray;
  return {
    sw: {
      latitude: bounds[0][1],
      longitude: bounds[0][0],
    },
    ne: {
      latitude: bounds[1][1],
      longitude: bounds[1][0],
    },
  };
};

export default function Home() {
  const [dataBounds, setDataBounds] = useLocalState<string>("bounds","[[0,0],[0,0]]");
  const [debouncedDataBounds] = useDebounce(dataBounds, 200);
  const { data, error } = useQuery<SnapshotsQuery, SnapshotsQueryVariables>(SNAPSHOTS_QUERY,{
      variables: { bounds: parseBounds(debouncedDataBounds) },
    }
  );
  const lastData = useLastData(data);

  if (error) return <Layout main={<div>Error loading houses</div>} />;

  return (
    <Layout
      main={
        <div className="flex">
          <div
            className="w-1/2 pb-4"
            style={{ maxHeight: "calc(100vh - 64px)", overflowX: "scroll" }}
          >
            <SnapshotList snapshots={lastData ? lastData.snapshots : []} />
          </div>
          <div className="w-1/2">
            <Map 
              setDataBounds={setDataBounds}
              snapshots={lastData ? lastData.snapshots : []} highlightedId={null}/>
          </div>
        </div>
      }
    />
  );;
}