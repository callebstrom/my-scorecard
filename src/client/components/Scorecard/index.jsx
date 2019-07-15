import React from 'react'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import { TableFooter } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  cell: {
    textAlign: 'center'
  },
  bold: {
    fontWeight: 'bold'
  }
}));

const calculateExtraStrokesForHole = (index, slope = 0, numberOfHoles = 18) => {
  const extraStrokeBaseline = Math.floor(slope / numberOfHoles)
  const numberOfHoleWithExtraStrokes = slope % numberOfHoles
  const isHoleEligableForExtraStrokesInAdditionToBaseline = numberOfHoleWithExtraStrokes >= index
  return isHoleEligableForExtraStrokesInAdditionToBaseline ? extraStrokeBaseline + 1 : extraStrokeBaseline
}

const calculateScore = (par, extraStrokesForHole, strokes) => {
  if (!strokes || strokes < 0 || strokes === '0') return '-'

  const score = 2 + (Number(par) + extraStrokesForHole - strokes)

  return score <= 0 ? '0' : `${score}`
}

const Scorecard = ({ scorecard, setStrokes, slope }) => {

  const classes = useStyles()

  const strokesTotal = scorecard && scorecard.reduce((prev, entry) => {
    return entry.strokes ? prev + parseInt(entry.strokes) : prev
  }, 0)

  const scoreTotal = scorecard && scorecard.reduce((prev, entry) => {
    const extraStrokesForHole = calculateExtraStrokesForHole(entry.index, slope)
    const score = Number(calculateScore(entry.par, extraStrokesForHole, entry.strokes))
    return prev + (Number.isNaN(score) ? 0 : score)
  }, 0)

  return <Box style={{ padding: '1rem' }} boxShadow={2}>
    <Table padding="checkbox" className={classes.table} size="small">
      <TableHead>
        <TableRow>
          <TableCell className={classes.cell}>Hole</TableCell>
          <TableCell className={classes.cell}>Index</TableCell>
          <TableCell className={classes.cell}>Par</TableCell>
          <TableCell className={classes.cell}>Strokes</TableCell>
          <TableCell className={classes.cell}>Points</TableCell>
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
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: '0.5rem', fontSize: '0.75rem' }}>{calculateExtraStrokesForHole(entry.index, slope)}</span>
              </div>
              <TextField
                className={classes.cell}
                fullWidth
                value={entry.strokes}
                required
                onChange={({ target: { value: strokes } }) => setStrokes(entry.hole, strokes)}
                inputProps={{
                  min: 1,
                  style: {
                    textAlign: 'center'
                  }
                }}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
            </TableCell>
            <TableCell className={[classes.cell, classes.bold]}>
              {calculateScore(
                entry.par,
                calculateExtraStrokesForHole(entry.index, slope),
                entry.strokes
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className={classes.cell} style={{ fontWeight: 'bold', color: 'black' }}>Total</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>
            <TextField
              className={classes.cell}
              fullWidth
              value={strokesTotal}
              inputProps={{
                min: 1,
                style: {
                  textAlign: 'center'
                }
              }}
              readOnly
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </TableCell>
          <TableCell>
            <TextField
              className={classes.cell}
              fullWidth
              value={scoreTotal}
              inputProps={{
                min: 1,
                style: {
                  textAlign: 'center'
                }
              }}
              readOnly
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </Box>
}

export default Scorecard