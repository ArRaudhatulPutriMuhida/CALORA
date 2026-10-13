export const sum = (foods, qty) =>
    foods.reduce((acc, food) => {
        const q = qty[food.id] || 0;
        for (const key of ['calories', 'protein', 'carbs', 'fat', 'price']) {
            acc[key] += Number(food[key]) * q;
        }
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, price: 0 });

// Helper: hitung nutrisi resep per porsi
export function getRecipeNutrition(recipe, foodsList) {
    let calories = 0, protein = 0, carbs = 0, fat = 0, price = 0;
    const servings = Math.max(1, Number(recipe.servings) || 1);
    (recipe.items || []).forEach(item => {
        const food = foodsList.find(f => f.id === item.foodId);
        if (food) {
            const q = Number(item.qty) || 0;
            calories += Number(food.calories) * q;
            protein += Number(food.protein) * q;
            carbs += Number(food.carbs) * q;
            fat += Number(food.fat) * q;
            price += Number(food.price) * q;
        }
    });
    return {
        calories: Math.round((calories / servings) * 10) / 10,
        protein: Math.round((protein / servings) * 10) / 10,
        carbs: Math.round((carbs / servings) * 10) / 10,
        fat: Math.round((fat / servings) * 10) / 10,
        price: Math.round(price / servings),
    };
}

// Helper: Smart Meal Recommendation berbasis aturan dan batas anggaran (FR-040)
export function generateMealRecommendation(foodsList, targetNutrition, maxBudget) {
    const karbos = foodsList.filter(f => f.category === 'Karbohidrat');
    const proteins = foodsList.filter(f => f.category === 'Protein');
    const sayurs = foodsList.filter(f => f.category === 'Sayuran');
    const buahs = foodsList.filter(f => f.category === 'Buah');

    let bestComb = null;
    let minDiff = Infinity;

    for (const k of karbos.slice(0, 2)) {
        for (const p of proteins.slice(0, 3)) {
            for (const s of sayurs.slice(0, 2)) {
                for (const b of buahs.slice(0, 2)) {
                    const cost = k.price + p.price + s.price + b.price;
                    if (cost <= maxBudget) {
                        const cal = k.calories + p.calories + s.calories + b.calories;
                        const diff = Math.abs(cal - targetNutrition.calories);
                        if (diff < minDiff) {
                            minDiff = diff;
                            bestComb = {
                                title: `Kombinasi ${k.name} + ${p.name} + ${s.name} + ${b.name}`,
                                items: { [k.id]: 1, [p.id]: 1, [s.id]: 1, [b.id]: 1 },
                                calories: cal,
                                protein: k.protein + p.protein + s.protein + b.protein,
                                carbs: k.carbs + p.carbs + s.carbs + b.carbs,
                                fat: k.fat + p.fat + s.fat + b.fat,
                                cost,
                                reason: `Pilar 4 gizi seimbang dengan ketercapaian ${Math.round(cal / targetNutrition.calories * 100)}% target AKG di dalam batas anggaran Rp${Number(maxBudget).toLocaleString('id-ID')}.`,
                            };
                        }
                    }
                }
            }
        }
    }
    return bestComb;
}
