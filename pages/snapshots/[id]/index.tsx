import { useRouter } from "next/router";
import { Image } from "cloudinary-react";
import { useQuery, gql } from "@apollo/client";
import Layout from "src/components/layout";
import {ShowSnapshotQuery,ShowSnapshotQueryVariables,} from "src/generated/ShowSnapshotQuery";
import SingleMap from "src/components/singleMap";
import SnapshotNav from "src/components/snapshotNav";

  
  const SHOW_SNAPSHOT_QUERY = gql`
    query ShowSnapshotQuery($id: String!) {
      snapshot(id: $id) {
        id
        userId
        address
        publicId
        description
        latitude
        longitude
        nearby {
            id
            latitude
            longitude
        }
      }
    }
  `;

  export default function ShowSnapshot() {
    const {query: { id },} = useRouter();
    
      if (!id) return null;
      return <SnapshotData id={id as string} />;
    }
    
    function SnapshotData({ id }: { id: string }) {
      const { data, loading } = useQuery<ShowSnapshotQuery, ShowSnapshotQueryVariables>(SHOW_SNAPSHOT_QUERY,{ variables: { id } });
    
      if (loading || !data) return <Layout main={<div>Loading...</div>} />;
      if (!data.snapshot)
        return <Layout main={<div>Unable to load Snapshot {id}</div>} />;
    
      const { snapshot } = data;
    
      return (
        <Layout
          main={
            <div className="sm:block md:flex">
              <div className="sm:w-full md:w-1/2 p-4">
              <SnapshotNav snapshot={snapshot} />
                <h1 className="text-3xl my-2">{snapshot.address}</h1>
    
                <Image
                  className="pb-2"
                  cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                  publicId={snapshot.publicId}
                  alt={snapshot.address}
                  secure
                  dpr="auto"
                  quality="auto"
                  width={900}
                  height={Math.floor((9 / 16) * 900)}
                  crop="fill"
                  gravity="auto"
                />
    
                <p>{snapshot.description}</p>
              </div>
              <div className="sm:w-full md:w-1/2">
                <SingleMap snapshot={snapshot} nearby={snapshot.nearby}/>
            </div>
            </div>
          }
        />
      );
  }