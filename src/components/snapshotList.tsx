import Link from "next/link";
import { Image } from "cloudinary-react";
import { SnapshotsQuery_snapshots } from "src/generated/SnapshotsQuery";

interface IProps {
    snapshots: SnapshotsQuery_snapshots[];
  }
  
  export default function HouseList({ snapshots }: IProps) {
    return (
      <>
        {snapshots.map((snapshots) => (
          <Link key={snapshots.id} href={`/snapshots/${snapshots.id}`}>
            <div className="px-6 pt-4 cursor-pointer flex flex-wrap">
              <div className="sm:w-full md:w-1/2">
                <Image
                  cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                  publicId={snapshots.publicId}
                  alt={snapshots.address}
                  secure
                  dpr="auto"
                  quality="auto"
                  width={350}
                  height={Math.floor((9 / 16) * 350)}
                  crop="fill"
                  gravity="auto"
                />
              </div>
              <div className="sm:w-full md:w-1/2 sm:pl-0 md:pl-4">
                <h2 className="text-lg">{snapshots.address}</h2>
                <p>{snapshots.description} </p>
              </div>
            </div>
          </Link>
        ))}
      </>
    );
  }