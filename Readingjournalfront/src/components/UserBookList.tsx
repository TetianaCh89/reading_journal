import { useQuery, useMutation, useQueryClient  } from "@tanstack/react-query";
import { getUserBooks, deleteReadingEntry } from "../api/bookapi";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
import type { ReadingEntryRes, ReadingStatus} from "../types";
import Book from "./Book";
import RatingCell from "./RatingCell";
import StatusCell from "./StatusCell";
import OpinionCell from "./OpinionCell";
import {AddRecordDialog} from "./AddRecord";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ToolTip from '@mui/material/Tooltip';

function UserBookList() {
    const [bookDialogOpen, setBookDialogOpen] = useState(false);

    const queryClient = useQueryClient();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["readingEntries"],
        queryFn: getUserBooks,
    });

    const [rows, setRows] = useState<ReadingEntryRes[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (data) setRows(data);
    }, [data]);
    
    const handleCellChange = <K extends keyof ReadingEntryRes>(
        id: string,
        field: K,
        value: ReadingEntryRes[K]) => {
        setRows(prev =>
            prev.map(r =>
            r._links.self.href === id ? { ...r, [field]: value } : r
            )
        );
    };

    const handleStatusChange = (id: string, newStatus: ReadingStatus) => {
    setRows(prev =>
        prev.map(r => {
        if (r._links.self.href !== id) return r;

        let startDate = r.startDate;
        let endDate = r.endDate;

        if (newStatus === 'READING' && !startDate?.trim()) {
            startDate = new Date().toISOString().split('T')[0];
        }

        if (newStatus === 'COMPLETED' && !endDate?.trim()) {
            endDate = new Date().toISOString().split('T')[0];
        }

        return { ...r, status: newStatus, startDate, endDate };
        })
    );
    };
    const { mutate } = useMutation({
        mutationFn: deleteReadingEntry, 
        onSuccess: () => {
            setOpen(true);
            queryClient.invalidateQueries({queryKey: ['readingEntries']});
        },
        onError: (err: unknown) => {
            console.error(err);
        },
    });
    const columns: GridColDef<ReadingEntryRes>[] = [
        {
            field: "title",
            headerName: "Book Title",
            width: 300,
            renderCell: (params: GridRenderCellParams<ReadingEntryRes>) => {
                const book = params.row.book;
                return book ? <Book bookdata={book} /> : <span>—</span>;
            },
        },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell: (params: GridRenderCellParams<ReadingEntryRes>) => (
                <StatusCell
                row={params.row}
                onStatusChange={(id, newStatus) =>
                    handleStatusChange(id, newStatus)
                }
                />
            ),
        },
        {
            field: "rating",
            headerName: "Rating",
            width: 150,
            renderCell: (params) => (
                <RatingCell
                value={params.row.rating}
                row={params.row}
                onRatingChange={(id, newRating) =>
                    handleCellChange(id, "rating", newRating)
                }
                />
            ),
        },
        {
            field: "opinion",
            headerName: "Opinion",
            width: 300,
            renderCell: (params) => (
                <OpinionCell variant="table"
                row={params.row}
                onOpinionChange={(id, newOpinion) => {
                    handleCellChange(id, "opinion", newOpinion)
                }}
                />
            ),
        },
        {
            field: "startDate",
            headerName: "Start date",
            width: 150,
            type: "date",
            editable: true,
            valueGetter: (_, row) => (row?.startDate ? new Date(row.startDate) : null),
        },
        {
            field: "endDate",
            headerName: "End date",
            width: 150,
            type: "date",
            editable: true,
            valueGetter: (_, row) => (row?.endDate ? new Date(row.endDate) : null),
        },
        {
            field: 'delete',
            headerName: '',
            width: 90,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams<ReadingEntryRes>) => (
                <ToolTip title="Delete record">
                <IconButton aria-label="delete" size="small" onClick={() => {
                    if(window.confirm(`Are you sure you want to delete "${params.row.book.title}" with status ${params.row.status}?`)){
                        mutate(params.row._links.self.href);
                        }
                    }}>
                    <DeleteIcon fontSize="small"/>
                </IconButton>
                </ToolTip>
            ),
        },
    ];

  if (isError) {
    return (
      <p style={{ color: "red" }}>
        Error: {error.message || "something went wrong..."}
      </p>
    );
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        
        <Button variant="outlined" onClick={() => setBookDialogOpen(true)}>
          📚 Add record
        </Button>

        <AddRecordDialog
          open={bookDialogOpen}
          onClose={() => setBookDialogOpen(false)}
          onRecordCreated={() => {
           queryClient.invalidateQueries({ queryKey: ["readingEntries"] });
          }}
        />
      </Stack>
      {/* <Container maxWidth="xl">  */}
        <DataGrid rows={rows} 
        columns={columns}
        getRowId={row => row._links.self.href} /> 
      {/* </Container> */}
      
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        message="Record deleted"
      />
    </>
  );
}

export default UserBookList;
