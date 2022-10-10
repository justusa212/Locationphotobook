import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
import { DeleteSnapshot, DeleteSnapshotVariables } from "src/generated/DeleteSnapshot";

const DELETE_MUTATION = gql`
  mutation DeleteSnapshot($id: String!) {
    deleteSnapshot(id: $id)
  }
`;

interface IProps {
    snapshot: {
      id: string;
      userId: string;
    };
  }
  
  export default function HouseNav({ snapshot }: IProps) {
    const router = useRouter();
    const { user } = useAuth();
    const canManage = !!user && user.uid === snapshot.userId;
    const [deleteSnapshot, { loading }] = useMutation<DeleteSnapshot,DeleteSnapshotVariables>(DELETE_MUTATION);

  
    return (
      <>
        <Link href="/">
          <a>map</a>
        </Link>
        {canManage && (
          <>
            {" | "}
            <Link href={`/snapshots/${snapshot.id}/edit`}>
              <a>edit</a>
            </Link>
            {" | "}
          <button
            disabled={loading}
            type="button"
            onClick={async () => {
              if (confirm("Are you sure?")) {
                await deleteSnapshot({ variables: { id: snapshot.id } });
                router.push("/");
              }
            }}
          >
            delete
          </button>
          </>
        )}
      </>
    );
  }
  