import { getMenusAround } from "@/app/actions";
import { MenuCard } from "@/components/MenuCard";

export default async function Home() {
  // Hardcoded coordinates for Casablanca demo
  const lat = 33.5731;
  const long = -7.5898;
  const radius = 5000;

  const menus = await getMenusAround(lat, long, radius);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-gray-50">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-8">
        <h1 className="text-4xl font-bold text-center w-full">DayEat - Offres du jour</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {menus && menus.length > 0 ? (
          menus.map((item) => (
            <MenuCard key={item.menu_item_id} item={item} />
          ))
        ) : (
          <div className="col-span-full text-center p-10">
            <p className="text-lg text-muted-foreground">Aucune offre disponible pour le moment à proximité.</p>
            <p className="text-sm text-gray-500 mt-2">Essayez de publier des offres via la base de données pour tester.</p>
          </div>
        )}
      </div>
    </main>
  );
}
