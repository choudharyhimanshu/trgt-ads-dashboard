import * as React from "react";
import {
  Container,
  Grid,
  Header,
  Icon,
  Input,
  Menu,
  Message,
  Placeholder,
  Table,
} from "semantic-ui-react";
import { GoogleSpreadsheet } from "google-spreadsheet";

import "./App.css";
import "semantic-ui-css/semantic.min.css";

const spreadSheet = new GoogleSpreadsheet(
  "1UrvCzs6UcuQkrn-0lu9_-bIGmLd4S8H6UihVVtiAyDw"
);
spreadSheet.useApiKey("AIzaSyARR-4zh3xPaMOYWhBRyQRfi-YVTl1CXMI");

function App() {
  const [dataState, setDataState] = React.useState({
    isLoading: true,
    title: "",
    headers: [],
    rows: [],
    error: "",
  });

  const [filteredRows, setFilteredRows] = React.useState([]);
  const [quickFilter, setQuickFilter] = React.useState("");

  React.useEffect(() => {
    spreadSheet
      .loadInfo()
      .then(() => {
        const sheet = spreadSheet.sheetsByIndex[2];
        sheet
          .getRows()
          .then((rows) => {
            setDataState({
              isLoading: false,
              title: sheet.title,
              headers: sheet.headerValues,
              rows: rows.map((row) => row._rawData),
              error: "",
            });
          })
          .catch((error) => {
            setDataState({
              isLoading: false,
              title: sheet.title,
              headers: [],
              rows: [],
              error: error.toString(),
            });
          });
      })
      .catch((error) => {
        setDataState({
          isLoading: false,
          title: "",
          headers: [],
          rows: [],
          error: error.toString(),
        });
      });
  }, []);

  React.useEffect(() => {
    setFilteredRows(
      dataState.rows.filter((row) => {
        return quickFilter
          ? row.join("").toLowerCase().includes(quickFilter.toLowerCase())
          : true;
      })
    );
  }, [dataState.rows, quickFilter]);

  return (
    <Container style={{ padding: "50px 0 50px 0" }}>
      {dataState.isLoading ? (
        <Placeholder fluid>
          <Placeholder.Header>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      ) : dataState.error ? (
        <Message
          negative
          icon="warning circle"
          header={"We're sorry, some unexpected error occurred :("}
          content={dataState.error}
        />
      ) : (
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <Header as={"h2"} style={{ paddingTop: 10 }}>
                {dataState.title}
              </Header>
            </Grid.Column>
            <Grid.Column width={4}>
              <Input
                icon="search"
                placeholder="Search..."
                fluid
                value={quickFilter}
                onChange={(event) => setQuickFilter(event.target.value)}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Table sortable celled>
                <Table.Header>
                  {dataState.headers.map((header) => (
                    <Table.HeaderCell>{header}</Table.HeaderCell>
                  ))}
                </Table.Header>
                <Table.Body>
                  {filteredRows.length > 0 ? (
                    filteredRows.map((row) => (
                      <Table.Row>
                        {row.map((cell) => (
                          <Table.Cell>{cell}</Table.Cell>
                        ))}
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell colSpan={4} style={{ textAlign: "center" }}>
                        No results found to display.
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan="4">
                      <Menu floated="right" pagination>
                        <Menu.Item as="a" icon disabled>
                          <Icon name="chevron left" />
                        </Menu.Item>
                        <Menu.Item as="a" disabled>
                          1
                        </Menu.Item>
                        <Menu.Item as="a" disabled>
                          2
                        </Menu.Item>
                        <Menu.Item as="a" disabled>
                          3
                        </Menu.Item>
                        <Menu.Item as="a" disabled icon>
                          <Icon name="chevron right" />
                        </Menu.Item>
                      </Menu>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </Container>
  );
}

export default App;
