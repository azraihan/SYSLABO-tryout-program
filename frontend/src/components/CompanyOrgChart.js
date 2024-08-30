import React, { useEffect, useRef } from "react";
import * as go from "gojs";
import jsPDF from "jspdf";

import { buildDepartmentTree } from "../data/departmentData";

//components
import CustomRoundedButton from "./CustomRoundedButton";
import HelpPopUpIcon from "./HelpPopUpIcon";

function flattenDataForGraph(
  data,
  arr = [],
  links = [],
  parentKey = undefined
) {
  if (!Array.isArray(data)) {
    data = [data]; // Ensure data is always an array for consistency
  }

  data.forEach((node) => {
    const existingNode = arr.find(
      (n) => n.name === node.name && n.department_head === node.department_head
    );
    const key = existingNode ? existingNode.key : arr.length; // Use existing key if node exists, otherwise use length

    if (!existingNode) {
      arr.push({
        key,
        name: node.name,
        department_head: node.department_head,
        description: node.description,
        members: node.members || [], // Ensures members are included, defaulting to an empty array if not provided
        expanded: false, // Default expanded state can be false
      });
    }

    if (parentKey !== undefined) {
      links.push({ from: parentKey, to: key });
    }

    if (node.children && node.children.length > 0) {
      flattenDataForGraph(node.children, arr, links, key);
    }
  });

  return { nodes: arr, links: links };
}

const CompanyOrgChart = ({departmentData}) => {
  const diagramRef = useRef(null);
  const myDiagram = useRef(null);

  useEffect(() => {
    if (departmentData.length === 0) {
      console.warn("No department data available");
      return;
    }
    
    const $ = go.GraphObject.make;

    if (!myDiagram.current) {
      myDiagram.current = $(go.Diagram, diagramRef.current, {
        "undoManager.isEnabled": true,
        layout: $(go.TreeLayout, { angle: 90, layerSpacing: 40 }),
        initialContentAlignment: go.Spot.Center, // Centers the diagram contents
        autoScale: go.Diagram.Uniform, // Scales the diagram uniformly on initial load
      });

      myDiagram.current.nodeTemplate = $(
        go.Node,
        "Auto",
        new go.Binding("isExpanded", "expanded").makeTwoWay(),
        $(go.Shape, "RoundedRectangle", { fill: "#f9f9f9", strokeWidth: 2 }),
        $(
          go.Panel,
          "Vertical",
          $(
            go.TextBlock,
            {
              margin: 10,
              textAlign: "center",
              font: "bold 18px sans-serif",
              stroke: "#333",
            },
            new go.Binding("text", "name")
          ),
          $(
            go.TextBlock,
            {
              margin: 3,
              textAlign: "center",
              font: "16px sans-serif",
              stroke: "#555",
            },
            new go.Binding("text", "department_head")
          ),
          $("PanelExpanderButton", "MEMBER_LIST", {
            alignment: go.Spot.Right,
            alignmentFocus: go.Spot.Left,
            // Adding a tooltip here
            toolTip: $(
              "ToolTip",
              $(
                "TextBlock",
                { margin: 4 }, // You can customize margin or other properties
                new go.Binding("text", "", function (data) {
                  // You can return a different text based on the data
                  return "Click to see members";
                })
              )
            ),
          }),

          $(
            go.Panel,
            "Vertical",
            { name: "MEMBER_LIST", visible: false },
            new go.Binding("itemArray", "members"),
            {
              margin: 3,
              stretch: go.GraphObject.Fill,
              defaultAlignment: go.Spot.Left,
            }
          )
        )
      );

      myDiagram.current.linkTemplate = $(
        go.Link, 
        $(go.Shape), // Link shape
        $(go.Shape, { toArrow: "Standard" }) // Arrowhead
      );

      const departmentTree = buildDepartmentTree(departmentData);
      const { nodes, links } = flattenDataForGraph(departmentTree);
      myDiagram.current.model = new go.GraphLinksModel(nodes, links);

      // Setup an event listener to disable autoScale after initial layout
      myDiagram.current.addDiagramListener(
        "InitialLayoutCompleted",
        function (e) {
          myDiagram.current.autoScale = go.Diagram.None; // Disable autoScale after initial load
        }
      );
    }
  }, [departmentData]);

  const handleExportPDF = async () => {
    const fetchImageAsBlob = async (imageUrl) => {
      const response = await fetch(imageUrl);
      return response.blob();
    };

    // Fetch the logo as a blob from the public folder
    fetchImageAsBlob("/syslabo_logo.png").then((logoBlob) => {
      const logoReader = new FileReader();
      logoReader.onloadend = () => {
        const logoBase64data = logoReader.result;

        const image = new Image();
        image.onload = () => {
          const logoWidth = 500; // Set a fixed width for the logo
          const logoHeight = image.height * (logoWidth / image.width); // Maintain aspect ratio

          myDiagram.current.makeImageData({
            scale: 2, // Adjust this scale to make the image fit as desired
            background: "white",
            returnType: "blob",
            maxSize: new go.Size(Infinity, Infinity),
            callback: (chartBlob) => {
              const chartReader = new FileReader();
              chartReader.onloadend = async () => {
                const chartBase64data = chartReader.result;

                const imgWidth = myDiagram.current.documentBounds.width * 2;
                const imgHeight = myDiagram.current.documentBounds.height * 2;

                const pdf = new jsPDF({
                  orientation: "landscape",
                  unit: "px",
                  format: [imgWidth + 700, imgHeight + 700], // Adding margins to the page size
                });

                const xOffset =
                  (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
                const yOffset =
                  (pdf.internal.pageSize.getHeight() - imgHeight) / 2;

                // Get the current date in both formats
                const today = new Date();
                const dateStr1 = today.toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const dateStr2 = today.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                // Calculate the position for the logo, title, and date
                const titleText = "組織図 (Organization Chart)";
                const titleWidth =
                  (pdf.getStringUnitWidth(titleText) * 120) /
                  pdf.internal.scaleFactor;
                const titleX =
                  (pdf.internal.pageSize.getWidth() - titleWidth) / 2;
                const titleY = yOffset - 40;
                const logoX =
                  (pdf.internal.pageSize.getWidth() - logoWidth) / 2;
                const logoY = titleY - logoHeight - 100;
                const dateX = pdf.internal.pageSize.getWidth() - 100; // Adjust as necessary
                const dateY = 80; // Top margin for the date

                const fontBlob = await fetch(
                  "./fonts/Noto_Sans_JP/NotoSansJP-VariableFont_wght.ttf"
                ).then((res) => res.blob());
                const fontBase64data = await new Promise((resolve) => {
                  const fontReader = new FileReader();
                  fontReader.onloadend = () =>
                    resolve(fontReader.result.split(",")[1]);
                  fontReader.readAsDataURL(fontBlob);
                });

                pdf.addFileToVFS(
                  "./fonts/Noto_Sans_JP/NotoSansJP-VariableFont_wght.ttf",
                  fontBase64data
                );
                pdf.addFont(
                  "./fonts/Noto_Sans_JP/NotoSansJP-VariableFont_wght.ttf",
                  "NotoSansJP",
                  "normal"
                );
                pdf.setFont("NotoSansJP");

                // Add the current date in Japanese
                pdf.setFontSize(60); // Smaller font size for the date
                pdf.text(dateStr1, dateX, dateY, { align: "right" });

                // Add the second date format
                pdf.setFontSize(60); // Same font size for the second date
                pdf.text(dateStr2, dateX, dateY + 70, { align: "right" });

                // Add logo and title
                pdf.setFontSize(120); // Make title bigger
                pdf.addImage(
                  logoBase64data,
                  "PNG",
                  logoX,
                  logoY,
                  logoWidth,
                  logoHeight
                );

                // Setting up the font for Japanese text
                const fontBlob2 = await fetch(
                  "./fonts/Noto_Sans_JP/static/NotoSansJP-Bold.ttf"
                ).then((res) => res.blob());
                const fontBase64data2 = await new Promise((resolve) => {
                  const fontReader = new FileReader();
                  fontReader.onloadend = () =>
                    resolve(fontReader.result.split(",")[1]);
                  fontReader.readAsDataURL(fontBlob2);
                });

                pdf.addFileToVFS(
                  "./fonts/Noto_Sans_JP/static/NotoSansJP-Bold.ttf",
                  fontBase64data2
                );
                pdf.addFont(
                  "./fonts/Noto_Sans_JP/static/NotoSansJP-Bold.ttf",
                  "NotoSansJPBold",
                  "normal"
                );
                pdf.setFont("NotoSansJPBold"); // Set the custom font for Japanese
                pdf.text(titleText, titleX, titleY);

                // Add the diagram image
                pdf.addImage(
                  chartBase64data,
                  "JPEG",
                  xOffset,
                  yOffset,
                  imgWidth,
                  imgHeight
                );
                pdf.save("組織図 (Organization Chart).pdf");
              };
              chartReader.readAsDataURL(chartBlob);
            },
          });
        };
        image.src = logoBase64data;
      };
      logoReader.readAsDataURL(logoBlob);
    });
  };

  const helpMessage= "You can zoom in and out in the organization chart, or drag around the nodes. The chart will be downloaded as per the state the chart will be in after the modifications you've done. You can also click on the expand icons in each node to see the members in each department."


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        gap: "2rem",
      }}
    >
      <div
        ref={diagramRef}
        style={{
          width: "90%",
          height: "600px",
          border: "2px solid black",
          borderRadius: "30px",
          overflow: "hidden",
          backgroundColor: "#c9c8db",
        }}
      ></div>
      <CustomRoundedButton
        textColor="#000"
        textColorOnHover="#fff"
        backgroundColor="#ffff00"
        backgroundColorOnHover="#000"
        borderRadius="30px"
        label="Export as PDF"
        handleClick={handleExportPDF}
      />

<HelpPopUpIcon message={helpMessage}/>
    </div>
  );
};

export default CompanyOrgChart;
