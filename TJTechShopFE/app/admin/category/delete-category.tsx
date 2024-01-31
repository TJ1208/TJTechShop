"use client"

import { deleteCategory, getAllCategories } from "@/app/api/category"
import CategoryModel from "@/app/models/category"
import DeleteImage from "@/app/scripts/delete-image"
import ModalToggle from "@/app/scripts/modal"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteCategoryButton(category: CategoryModel) {
    const [showDeleteMessage, setShowDeleteMessage] = useState<boolean>(false);
    let router = useRouter();

    const removeCategory = (name: string) => {
        DeleteImage(name, "categories");
        deleteCategory(name).then((res) => {
            toggleModal();
            getAllCategories().then(() => {
                router.refresh();
            })
        })
    }

    const toggleModal = () => {
        ModalToggle("modal2", "modal-backdrop2");
        setShowDeleteMessage(old => !old);
    }

    return (
        <>
            <FontAwesomeIcon icon={faTrashCan} className="hover:cursor-pointer hover:text-red-400 nav-button" onClick={() => setShowDeleteMessage(old => !old)} />
            <dialog open={showDeleteMessage} className="modal z-40" id="modal2">
                <div className="border rounded font-medium shadow">
                    <p className="p-3 border-b w-full">Delete the category, <strong>{category.name}</strong>?</p>
                    <div className="flex items-center justify-end p-3">
                        <button className="nav-button bg-red-600 hover:bg-red-300" onClick={() => {
                            removeCategory(category.name);
                        }}>Delete</button>
                        <button className="nav-button bg-slate-400" onClick={toggleModal}>Cancel</button>
                    </div>
                </div>
            </dialog>

            <dialog open={showDeleteMessage} className="modal-backdrop z-30" id="modal-backdrop2" onClick={toggleModal} />

        </>
    )

}


export default DeleteCategoryButton
