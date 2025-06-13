import  QRCodeGeneratorForm  from "./QrCodeForm"
import { useState } from "react"
import DashboardLayout from "../../components/dashboard-layout"
import { Button } from "../../components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const CreateQrCode = () => {
  

    const [loading] = useState(false)

    if  (loading) {
        return (
            <DashboardLayout>
                           <div className="flex justify-center py-8">
                               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                           </div>
                       </DashboardLayout>
        )
    }

  return (
    <DashboardLayout>
    <div className="space-y-6">
       <div className="flex items-center  gap-4">
        <Button asChild variant="outline" size="sm" className="border-gray-700 text-gray-200 hover:bg-gray-800  ">
            <Link to="/qr-codes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
            </Link>
        </Button>
        <h1 className="text-2xl font-bold ml-6 md:ml-12">Create QR Code</h1>
    </div>
      <QRCodeGeneratorForm theme="dark" />
      
    </div>
    </DashboardLayout>
  )

}
export default CreateQrCode;
