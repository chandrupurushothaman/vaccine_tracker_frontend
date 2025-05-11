import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import React from 'react'
import { _get } from '../api/client';
import { Add as AddIcon, Delete as RemoveIcon } from '@mui/icons-material'

const ReportsFilter = ({getFilteredData=() => {}}) => {
    const [filters, setFilters] = React.useState([
        {filterType: "", filterValue: ""},
    ])
    const [filterTypes, setFilterTypes] = React.useState([
        {label: "Vaccination Name", value: "vaccineName"},
        {label: "Is Vaccinated", value: "vaccinationStatus"},
        {label: "Class", value: "class"},
    ]);
    const [vaccines, setVaccines] = React.useState([]);
    const handleFilterChange = (key, value, index) => {
        console.log(key, value, index)
        const updatedFilters = [...filters];
        updatedFilters[index][key] = value;
        setFilters(updatedFilters);
        if (key === "filterType" || key === "filterValue") {
            updateFilterTypesAvailability(updatedFilters);
        }
    }
    const updateFilterTypesAvailability = (currentFilters) => {
        const selectedFilterTypes = currentFilters.map(filter => filter.filterType).filter(type => type);
        
        const hasNotVaccinatedFilter = currentFilters.some(
            filter => filter.filterType === "vaccinationStatus" && filter.filterValue === false
        );

        const hasVaccineNameFilter = currentFilters.some(
            filter => filter.filterType === "vaccineName" && filter.filterValue
        );
        
        const updatedFilterTypes = filterTypes.map(type => {
            const isAlreadySelected = selectedFilterTypes.includes(type.value);
            const disableVaccineName = type.value === "vaccineName" && hasNotVaccinatedFilter;
            const disableVaccinationStatus = type.value === "vaccinationStatus" && hasVaccineNameFilter;
            
            return {
                ...type,
                disabled: isAlreadySelected || disableVaccineName || disableVaccinationStatus
            };
        });
        
        setFilterTypes(updatedFilterTypes);
    }
    React.useEffect(() => {
        loadFilterDatas()
    }, [])
    React.useEffect(() => {
        updateFilterTypesAvailability(filters);
    }, [filters]);
    const loadFilterDatas = async () => {
        await getAllVaccines()
    }
    const getAllVaccines = async () => {
        await _get('/vaccinations', {})
        .then((res) => {
            if (res.status !== 200) {
                throw new Error("Failed to fetch data");
            }
            const resp = res.data;
            if (resp.success === true && resp.data) {
                setVaccines(resp.data);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const addNewFilter = () => {
        const newFilter = {filterType: "", filterValue: ""};
        setFilters([...filters, newFilter]);
    }
    const removeFilter = (index) => {
        const updatedFilters = filters.filter((_, i) => i !== index);
        setFilters(updatedFilters);
    }
    const handleGenerateReport = () => {
        console.log(filters);
        getFilteredData(filters);
    }
    const handleFilterReset = () => {
        setFilters([{filterType: "", filterValue: ""}]);
    }
    return (
        <Paper sx={{overflow: 'scroll', padding: "10px" }}>
            <Grid container direction="column" spacing={2} sx={{ alignItems: "baseline", width: "100%" }}>
                {filters.map((filter, index) => <Box key={index} sx={{ width: "100%" }}>
                    <Grid container spacing={1} sx={{ alignItems: "center" }}>
                        <Grid size={5}>
                            <FormControl fullWidth>
                                <InputLabel size='small' id="select-filter-type" fullWidth>Filter Type</InputLabel>
                                <Select 
                                    size='small'
                                    labelId="select-filter-type"
                                    id="filter-type"
                                    value={filter.filterType}
                                    label="Filter Type"
                                    onChange={(e) => handleFilterChange("filterType", e.target.value, index)} fullWidth
                                >
                                    <MenuItem value="" disabled>--Select Filter Type--</MenuItem>
                                    {filterTypes.map((type, index) => <MenuItem key={index} value={type.value} disabled={type?.disabled}>{type.label}</MenuItem>)}    
                                </Select>
                            </FormControl>
                        </Grid>
                        {filter.filterType && <Grid size={5}>
                            <FormControl fullWidth>
                                <InputLabel size='small' id="select-filter-value" fullWidth>Filter Value</InputLabel>
                                {filter.filterType === "vaccineName" && <Select 
                                    size='small'
                                    labelId="select-filter-value"
                                    id="filter-value"
                                    value={filter.filterValue}
                                    label="Filter Value"
                                    onChange={(e) => handleFilterChange("filterValue", e.target.value, index)} fullWidth
                                >
                                    <MenuItem value="" disabled>--Select Filter Value--</MenuItem>
                                    {vaccines.map(vaccine => <MenuItem value={vaccine.name} id={vaccine._id}>{vaccine?.name || 'No Name'}</MenuItem>)}
                                </Select>}
                                {filter.filterType === "vaccinationStatus" && <Select 
                                    size='small'
                                    labelId="select-filter-value"
                                    id="filter-value"
                                    value={filter.filterValue}
                                    label="Filter Value"
                                    onChange={(e) => handleFilterChange("filterValue", e.target.value, index)} fullWidth
                                >
                                    <MenuItem value="" disabled>--Select Filter Value--</MenuItem>
                                    {[{value: true, name: 'Vaccinated' }, {value: false, name: 'Not Vaccinated' }].map((vaccineStatus, index) => <MenuItem value={vaccineStatus.value} id={index}>{vaccineStatus?.name || 'No Name'}</MenuItem>)}    
                                </Select>}
                                {filter.filterType === "class" && <Select 
                                    size='small'
                                    labelId="select-filter-value"
                                    id="filter-value"
                                    value={filter.filterValue}
                                    label="Filter Value"
                                    onChange={(e) => handleFilterChange("filterValue", e.target.value, index)} fullWidth
                                >
                                    <MenuItem value="" disabled>--Select Filter Value--</MenuItem>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((classValue, index) => <MenuItem value={classValue} id={index}>{classValue}</MenuItem>)}
                                </Select>}
                            </FormControl>
                        </Grid>}
                        <Grid size={2}>
                            {index+1 === filters.length ? filters.length !== filterTypes.length-1 && <Button
                                variant="outlined"
                                size="small"
                                color="success"
                                startIcon={<AddIcon/>}
                                onClick={() => {
                                    addNewFilter(index);
                                }}
                                disabled={!filter.filterType || filter.filterValue === ""}
                            >Add</Button>
                            : <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                startIcon={<RemoveIcon/>}
                                onClick={() => {
                                    removeFilter(index);
                                }}
                            >Remove</Button>}
                        </Grid>
                    </Grid>
                </Box>)}
                <Grid container spacing={1}>
                    <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={() => {
                            handleGenerateReport();
                        }}
                        disabled={!filters[0]?.filterType || filters[0]?.filterValue === ""}
                    >Generate Report</Button>
                    <Grid item>
                        <Button
                            variant="outlined"
                            size="small"
                            color="warning"
                            onClick={handleFilterReset}
                            disabled={filters.length === 1 && !filters[0]?.filterType}
                        >
                            Reset Filters
                        </Button>
                    </Grid>
                </Grid>
            </Grid>            
        </Paper>
    )
}

export default ReportsFilter;