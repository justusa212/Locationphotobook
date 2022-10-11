import { GetServerSideProps, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { loadIdToken } from "src/auth/firebaseAdmin";
import Layout from "src/components/layout";
import SnapshotForm from "src/components/snapshotForm";
import { useAuth } from "src/auth/useAuth";
import {EditSnapshotQuery,EditSnapshotQueryVariables,} from "src/generated/EditSnapshotQuery";

const EDIT_SNAPSHOT_QUERY = gql`
  query EditSnapshotQuery($id: String!) {
    snapshot(id: $id) {
      id
      userId
      address
      image
      publicId
      description
      latitude
      longitude
    }
  }
`;

export default function EditHouse(){
    const {
        query: { id },
      } = useRouter();
    
      if (!id) return null;
      return <SnapshotData id={id as string} />;
}
function SnapshotData({ id }: { id: string }) {
    const { user } = useAuth();
    const { data, loading } = useQuery<EditSnapshotQuery, EditSnapshotQueryVariables>(
        EDIT_SNAPSHOT_QUERY,
      { variables: { id } }
    );
  
    if (!user) return <Layout main={<div>Please login</div>} />;
    if (loading) return <Layout main={<div>loading...</div>} />;
    if (data && !data.snapshot)
      return <Layout main={<div>Unable to load snapshot</div>} />;
    if (user.uid !== data?.snapshot?.userId)
      return <Layout main={<div>You do not have permission</div>} />;
  
    return <Layout main={<SnapshotForm snapshot={data.snapshot} />} />;
  }
  
  export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const uid = await loadIdToken(req as NextApiRequest);
  
    if (!uid) {
      res.setHeader("location", "/auth");
      res.statusCode = 302;
      res.end();
    }
  
    return { props: {} };
  };