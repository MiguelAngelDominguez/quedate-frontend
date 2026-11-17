import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { RoomSummaryDTO, UniversityDTO } from '@/types/api'

// Fix default marker icon paths in Vite
const roomIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const universityIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface Props {
  rooms: RoomSummaryDTO[]
  universities?: UniversityDTO[]
}

export function RoomMap({ rooms, universities = [] }: Props) {
  const validRooms = rooms.filter((r) => r.latitude != null && r.longitude != null)
  const validUnis = universities.filter((u) => u.latitude != null && u.longitude != null)

  const center: [number, number] = validRooms.length
    ? [validRooms[0].latitude as number, validRooms[0].longitude as number]
    : validUnis.length
    ? [validUnis[0].latitude as number, validUnis[0].longitude as number]
    : [-12.0464, -77.0428] // Lima

  return (
    <div className="relative z-0 h-[70vh] w-full overflow-hidden rounded-xl border">
      <MapContainer center={center} zoom={12} className="h-full w-full" style={{ zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validRooms.map((room) => (
          <Marker
            key={room.id}
            position={[room.latitude as number, room.longitude as number]}
            icon={roomIcon}
          >
            <Popup>
              <strong>{room.title}</strong>
              <br />
              S/ {room.price}
              <br />
              {room.district}
              <br />
              <a href={`/rooms/${room.id}`} className="text-primary hover:underline">
                Ver detalle →
              </a>
            </Popup>
          </Marker>
        ))}
        {validUnis.map((uni) => (
          <Marker
            key={`uni-${uni.id}`}
            position={[uni.latitude as number, uni.longitude as number]}
            icon={universityIcon}
          >
            <Popup>
              <strong>{uni.name}</strong>
              {uni.campusName && (
                <>
                  <br />
                  {uni.campusName}
                </>
              )}
              <br />
              <span className="text-xs text-muted-foreground">Universidad</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}