import "./CategoryCard.css";

function CategoryCard({
    category,
    selectedCategory,
    setSelectedCategory
}){

    return(

        <div

        className={
            selectedCategory===category.name
            ?"category-card active"
            :"category-card"
        }

        onClick={()=>setSelectedCategory(category.name)}

        >

            <h3>{category.name}</h3>

        </div>

    );

}

export default CategoryCard;