import React from 'react'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  bold: {
    fontWeight: 'bold'
  }
}));

const calculateScore = (par, index, strokes, slope = 0, numberOfHoles = 18) => {
  const extraStrokeBaseline = Math.floor(slope / numberOfHoles)
  const numberOfHoleWithExtraStrokes = slope % numberOfHoles
  const isHoleEligableForExtraStrokesInAdditionToBaseline = numberOfHoleWithExtraStrokes >= index
  const extraStrokesForHole = isHoleEligableForExtraStrokesInAdditionToBaseline ? extraStrokeBaseline + 1 : extraStrokeBaseline
  const score = 2 + (Number(par) + extraStrokesForHole - strokes)

  if (Number.isNaN(score)) return '-'

  return score <= 0 ? '0' : `${score}`
}

const Scorecard = ({ scorecard, setStrokes, slope }) => {

  const classes = useStyles()

  return <Box style={{ padding: '1rem' }} boxShadow={2}>
    <Table padding="checkbox" className={classes.table} size="small">
      <TableHead>
        <TableRow>
          <TableCell>Hole</TableCell>
          <TableCell>Index</TableCell>
          <TableCell>Par</TableCell>
          <TableCell>Strokes</TableCell>
          <TableCell>Points</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {scorecard && scorecard.map((entry, i) => (
          <TableRow key={entry.hole}>
            <TableCell className={[classes.cell, classes.bold]}>
              {entry.hole}
            </TableCell>
            <TableCell className={classes.cell}>
              {entry.index}
            </TableCell>
            <TableCell className={classes.cell}>{entry.par}</TableCell>
            <TableCell>
              <TextField
                className={classes.cell}
                fullWidth
                value={entry.strokes}
                required
                onChange={({ target: { value: strokes } }) => setStrokes(entry.hole, strokes)}
                inputProps={{
                  min: 1
                }}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
            </TableCell>
            <TableCell className={[classes.cell, classes.bold]}>
              {calculateScore(entry.par, entry.index, entry.strokes, slope)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
}

export default Scorecard