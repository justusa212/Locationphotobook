import { SetStateAction, useState } from "react";
import Link from "next/link";
import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface ISnapshot {
    id: string;
    latitude: number;
    longitude: number;
  }
  
  interface IProps {
    snapshot: ISnapshot;
    nearby: ISnapshot[];
  }
  
  export default function SingleMap({ snapshot,nearby }: IProps) {

    const [viewState, setViewState] = useState({
      latitude: snapshot.latitude,
      longitude: snapshot.longitude,
      zoom: 13,
    });
  
    return (
        <div className="text-black">
      <ReactMapGL
        {...viewState}
        width="100%"
        height="calc(100vh - 64px)"
        onViewportChange={(nextViewport: SetStateAction<{ latitude: number; longitude: number; zoom: number; }>) => setViewState(nextViewport)}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
        scrollZoom={false}
        minZoom={8}
      >

        <Marker
          latitude={snapshot.latitude}
          longitude={snapshot.longitude}
          offsetLeft={-15}
          offsetTop={-15}
        >
          <button
            type="button"
            style={{ width: "30px", height: "30px", fontSize: "30px" }}
          >
            <img src="/home-color.svg" className="w-8" alt="selected house" />
          </button>
        </Marker>

        {nearby.map((near) => (
          <Marker
            key={near.id}
            latitude={near.latitude}
            longitude={near.longitude}
            offsetLeft={-15}
            offsetTop={-15}
          >
            <Link href={`/snapshots/${near.id}`}>
              <a style={{ width: "30px", height: "30px", fontSize: "30px" }}>
                <img src="/home-solid.svg" className="w-8" alt="nearby snapshot" />
              </a>
            </Link>
          </Marker>
        ))}
      </ReactMapGL>
    </div>
    );
  }