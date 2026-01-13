export default function Page() {
  const users: string[] = ["dabiel", "sdf111", "aggg23"];

  return (
    <main>
      <ul>
        {users.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </main>
  );
}
