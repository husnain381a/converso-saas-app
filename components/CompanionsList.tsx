import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

//typescasting for props
interface CompanionsListProps{
  title: string;
  companions?: Companion[];
  classNames?: string;
}

const CompanionsList = ({title, companions, classNames} : CompanionsListProps) => {
  return (
    <article className={cn('companion-list', classNames)}>
      <h2 className="font-bold text-3xl">Recent Sessions</h2>

      <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="text-lg w-2/3">Lessons</TableHead>
      <TableHead className="text-lg">Subject</TableHead>
      <TableHead className="text-lg text-right">Duration</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {companions?.map((companion)=>(
      <TableRow key={companion.id}>
        {/* For Lessons */}
        <TableCell>
          <Link href={`/companions/${companion.id}`}>
            <div className="flex items-center gap-2">
              <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style={{backgroundColor: companion.color}}>
                <Image src={`/icons/${companion.subject}.svg`} alt={companion.subject} width={35} height={35}/>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-bold text-2xl">{companion.name}</p>
                <p className="text-lg">{companion.topic}</p>
              </div>
            </div>
          </Link>
        </TableCell>

        {/* For Subjects */}
        <TableCell>
          {/* For Desktop */}
          <div className="subject-badge w-fit max-md:hidden">
            {companion.subject}
          </div>
          {/* For Mobile */}
          <div className="flex items-center justify-center rounded-lg w-fit p-2 md:hidden" style ={{backgroundColor: companion.color}}>
             <Image src={`/icons/${companion.subject}.svg`} alt={companion.subject} width={18} height={18}/>
          </div>
        </TableCell>

        {/* For Duration */}
        <TableCell>
          <div className="flex items-center gap-2 w-full justify-end">
            {/* For Desktop */}
            <p className="text-2xl">{companion.duration} {' '} <span className="max-md:hidden">mins</span></p>
            {/* For Mobile */}
            <Image src="/icons/clock.svg" alt="clock" width={14} height={14} className="md:hidden"/>
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
    </article>
  )
}

export default CompanionsList
