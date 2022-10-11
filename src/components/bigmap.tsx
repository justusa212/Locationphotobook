import { SetStateAction, useRef, useState } from "react";
import Link from "next/link";
import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
import { Image } from "cloudinary-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocalState } from "src/utils/useLocalState";
import { SnapshotsQuery_snapshots } from "src/generated/SnapshotsQuery";
import { SearchBox } from "./searchBox";

interface IProps {
  setDataBounds: (bounds: string) => void;
  snapshots: SnapshotsQuery_snapshots[];
  highlightedId: string | null;
}

export default function Map({ setDataBounds, snapshots, highlightedId }: IProps) {
  const [selected, setSelected] = useState<SnapshotsQuery_snapshots | null>(null);
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewState, setViewState] = useLocalState("viewport",{
    latitude: 43,
    longitude: -79,
    zoom: 10,
  });

  return (
    <div className="text-black relative">
      <ReactMapGL
        {...viewState}
        width="100%"
        height="calc(100vh - 64px)"
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onViewportChange={(nextViewport) => setViewState(nextViewport)}
        ref={(instance) => (mapRef.current = instance)}
        minZoom={5}
        maxZoom={15}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
        onLoad={() => {
          if (mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds();
            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
        onInteractionStateChange={(extra) => {
          if (!extra.isDragging && mapRef.current) {
            const bounds = mapRef.current.getMap().getBounds();
            setDataBounds(JSON.stringify(bounds.toArray()));
          }
        }}
      >
        <div className="absolute top-0 w-full z-10 p-4">
          <SearchBox
            defaultValue=""
            onSelectAddress={(_address, latitude, longitude) => {
              if (latitude && longitude) {
                setViewState((old) => ({
                  ...old,
                  latitude,
                  longitude,
                  zoom: 12,
                }));
                if (mapRef.current) {
                  const bounds = mapRef.current?.getMap().getBounds();
                  setDataBounds(JSON.stringify(bounds.toArray()));
                }
              }
            }}
          />
        </div>
        {snapshots.map((snapshot) => (
          <Marker
            key={snapshot.id}
            latitude={snapshot.latitude}
            longitude={snapshot.longitude}
            offsetLeft={-15}
            offsetTop={-15}
            className={highlightedId === snapshot.id ? "marker-active" : ""}
          >
            <button
              style={{ width: "30px", height: "30px", fontSize: "30px" }}
              type="button"
              onClick={() => setSelected(snapshot)}
            >
              <img
                src={highlightedId === snapshot.id? "/home-color.svg": "/home-solid.svg"}
                alt="house"
                className="w-8"
              />
            </button>
          </Marker>
        ))}

        {selected && (
          <Popup
            latitude={selected.latitude}
            longitude={selected.longitude}
            onClose={() => setSelected(null)}
            closeOnClick={false}
          >
            <div className="text-center">
              <h3 className="px-4">{selected.address}</h3>
              <Image
                className="mx-auto my-4"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={selected.publicId}
                secure
                dpr="auto"
                quality="auto"
                width={200}
                height={Math.floor((9 / 16) * 200)}
                crop="fill"
                gravity="auto"
              />
              <Link href={`/snapshots/${selected.id}`}>
                <a>View Snapshot</a>
              </Link>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}
  
