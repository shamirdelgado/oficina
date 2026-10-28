// Mientras la pared de la sala de espera está arriba, nadie del otro lado se ve.
export const lobby = { closed: false }
export const lobbyWallZ = 2.9

export function hiddenByLobby(z: number) {
  return lobby.closed && z < lobbyWallZ
}
