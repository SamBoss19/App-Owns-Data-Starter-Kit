interface ReportPathProps {
  reportPath: string;
  tokenExpiration: string;
  refreshEmbedToken: () => void;
}

const ReportPath = ({ reportPath, tokenExpiration, refreshEmbedToken }: ReportPathProps) => {
  return (
    <div className="flex max-h-[36px] w-full bg-path-gradient">
      <div className="min-h-[36px] pl-3 pt-2 font-sans text-base text-white">
        {reportPath}
      </div>
      <button
        type="button"
        onClick={refreshEmbedToken}
        className="ml-auto mr-4 pt-3 font-sans text-[10px] text-[#666666] hover:bg-[#666666] hover:text-yellow-300"
      >
        {tokenExpiration}
      </button>
    </div>
  )
}

export default ReportPath
