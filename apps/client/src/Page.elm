module Page exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)


type Page
    = Other


type Msg
    = GotHomeMsg
    | GotLoginMsg


view : Page -> { title : String, content : Html msg } -> Browser.Document msg
view page { title, content } =
    { title = title ++ " - Conduit"
    , body = [ viewHeader page, content, viewFooter ]
    }


viewHeader : Page -> Html msg
viewHeader page =
    nav [ class "navbar navbar-light" ]
        [ div [ class "container" ]
            [ a [ class "navbar-brand", Route.href Route.Home ]
                [ text "conduit" ]
            ]
        ]


viewFooter : Html msg
viewFooter =
    footer []
        [ div [ class "container" ]
            [ a [ class "logo-font", href "/" ] [ text "conduit" ]
            , span [ class "attribution" ]
                [ text "An interactive learning project from "
                , a [ href "https://thinkster.io" ] [ text "Thinkster" ]
                , text ". Code & design licensed under MIT."
                ]
            ]
        ]
