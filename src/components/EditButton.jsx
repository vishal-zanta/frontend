import React from 'react'
import { Button } from "./ui/button"
import { Pencil } from 'lucide-react'

const EditButton = ({onClick, text="Edit", }) => {
  return (
     <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
          >
            <Pencil className="w-3.5 h-3.5 mr-1" /> {text}
          </Button>
  )
}

export default EditButton