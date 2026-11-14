import { DriveAutoBackup } from "@/components/tools/DriveAutoBackup"

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DriveAutoBackup />
    </>
  )
}
