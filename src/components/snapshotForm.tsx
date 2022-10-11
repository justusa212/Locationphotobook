import { useState, useEffect, ChangeEvent } from "react";
import { Router, useRouter } from "next/router";
import { Image } from "cloudinary-react";
import { useForm } from "react-hook-form";
import { SearchBox } from "./searchBox";
import Link from "next/link";
import { useMutation, gql } from "@apollo/client";
import { CreateSignatureMutation } from "src/generated/CreateSignatureMutation";
import {CreateSnapshotMutation, CreateSnapshotMutationVariables } from "src/generated/CreateSnapshotMutation";
import {UpdateSnapshotMutation,UpdateSnapshotMutationVariables,} from "src/generated/UpdateSnapshotMutation";

interface IFormData {
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  image: FileList;
}

interface ISnapshot {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  publicId: string;
}

interface IProps {
  snapshot?: ISnapshot;
}

const SIGNATURE_MUTATION = gql`
  mutation CreateSignatureMutation {
    createImageSignature {
      signature
      timestamp
    }
  }
`;

const CREATE_SNAPSHOT_MUTATION = gql`
  mutation CreateSnapshotMutation($input: SnapshotInput!) {
    createSnapshot(input: $input) {
      id
    }
  }
`;

const UPDATE_SNAPSHOT_MUTATION = gql`
  mutation UpdateSnapshotMutation($id: String!, $input: SnapshotInput!) {
    updateSnapshot(id: $id, input: $input) {
      id
      image
      publicId
      latitude
      longitude
      description
      address
    }
  }
`;

interface IUploadImageResponse {
  secure_url: string;
}

async function uploadImage(image: File,signature: string,timestamp: number): Promise<IUploadImageResponse> {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", image);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? "");

  const response = await fetch(url, {
    method: "post",
    body: formData,
  });
  return response.json();
}

export default function SnapshotForm({snapshot}: IProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const { register, handleSubmit, setValue, watch, formState: {errors} } = useForm<IFormData>({ defaultValues: 
    snapshot? {
        address: snapshot.address,
        latitude: snapshot.latitude,
        longitude: snapshot.longitude,
        description: snapshot.description,
      }
    : {}, });
  const address = watch("address");
  const [createSignature] = useMutation<CreateSignatureMutation>(SIGNATURE_MUTATION);
  const [createSnapshot] = useMutation<CreateSnapshotMutation,CreateSnapshotMutationVariables>(CREATE_SNAPSHOT_MUTATION);
  const [updateSnapshot] = useMutation<UpdateSnapshotMutation,UpdateSnapshotMutationVariables>(UPDATE_SNAPSHOT_MUTATION);

  useEffect(() => {
    register("address", { required: "Please enter your address" });
    register("latitude", { required: true, min: -90, max: 90 });
    register("longitude", { required: true, min: -180, max: 180 });
  }, [register]);

  const handleCreate = async (data: IFormData) => {
    const { data: signatureData } = await createSignature();
    if (signatureData) {
      const { signature, timestamp } = signatureData.createImageSignature;
      const imageData = await uploadImage(data.image[0], signature, timestamp);

      const { data: snapshotData } = await createSnapshot({
        variables: {
          input: {
            address: data.address,
            image: imageData.secure_url,
            coordinates: {
              latitude: data.latitude,
              longitude: data.longitude,
            },
            description: data.description,
          },
        },
      });

      if (snapshotData?.createSnapshot) {
        router.push(`/snapshots/${snapshotData.createSnapshot.id}`);
      }
    }
  }

  const handleUpdate = async (currentSnapshot: ISnapshot, data: IFormData) => {
    let image = currentSnapshot.image;

    if (data.image[0]) {
      const { data: signatureData } = await createSignature();
      if (signatureData) {
        const { signature, timestamp } = signatureData.createImageSignature;
        const imageData = await uploadImage(data.image[0],signature,timestamp);
        image = imageData.secure_url;
      }
    }

    const { data: snapshotData } = await updateSnapshot({
      variables: {
        id: currentSnapshot.id,
        input: {
          address: data.address,
          image: image,
          coordinates: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
          description: data.description,
        },
      },
    });

    if (snapshotData?.updateSnapshot) {
      router.push(`/snapshots/${currentSnapshot.id}`);
    }
  };

  const onSubmit = (data: IFormData) => {
    setSubmitting(false);
    if (!!snapshot) {
      handleUpdate(snapshot, data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <form className="mx-auto max-w-xl py-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl">
        {snapshot ? `Editing ${snapshot.address}` : "Add a New Snapshot"}
      </h1>

      <div className="mt-4">
        <label htmlFor="search" className="block">
          Add your address
        </label>
        <SearchBox
          onSelectAddress={(address, latitude, longitude) => {
            setValue("address", address);
            setValue("latitude", latitude!);
            setValue("longitude", longitude!);
          }}
          defaultValue={snapshot ? snapshot.address : ""}
        />
        {errors.address && <p>{errors.address.message}</p>}
      </div>
      
      {address && (
        <>
          <div className="mt-4">
            <label
              htmlFor="image"
              className="p-4 border-dashed border-4 border-gray-600 block cursor-pointer"
            >
              Click to add image (16:9)
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={register({
                validate: (fileList: FileList) => {
                  if (snapshot ||fileList.length === 1) return true;
                  return "Please upload one file";
                },
              })}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event?.target?.files?.[0]) {
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {previewImage ? (
              <img
                src={previewImage}
                className="mt-4 object-cover"
                style={{ width: "576px", height: `${(9 / 16) * 576}px` }}
              />
              ) : snapshot ? (
                <Image
                  className="mt-4"
                  cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                  publicId={snapshot.publicId}
                  alt={snapshot.address}
                  secure
                  dpr="auto"
                  quality="auto"
                  width={576}
                  height={Math.floor((9 / 16) * 576)}
                  crop="fill"
                  gravity="auto"
                />
              ) : null}
            {errors.image && <p>{errors.image.message}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="description" className="block">
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500"
              ref={register({
                required: "Please enter a description",
              })}
            />
            {errors.description && <p>This field is required</p>}
            {errors.description && <p>{errors.description.message}</p>}
          </div>

          <div className="mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
              type="submit"
              disabled={submitting}
            >
              Save
            </button>{" "}
            <Link href={snapshot ? `/snapshots/${snapshot.id}` : "/"}>
              <a>Cancel</a>
            </Link>
          </div>
        </>
      )}
    </form>
  );
}