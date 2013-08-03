(ns data-enrichment-and-analysis.data
  (:use cascalog.api)
  (:use cascalog.playground)
  (:require [cascalog.ops :as c]))

(def file-path "data/firstnames-sample.csv")

(let [names (<- [?name]
                ((lfs-textline file-path) ?line)
                (clojure.string/split ?line #"," 5 :> ?name _ _ _ _))
      names-count-year (<- [?name ?count ?year]
                           ((lfs-textline file-path) ?line)
                           (clojure.string/split ?line #"," 5 :> ?name _ ?count _ ?year)
                           (:distinct false))]
     (??-
      (c/first-n names-count-year 50000)))

(comment
  (let [list-entry (<- [?name ?rank ?count ?sex ?year]
                       ((lfs-textline file-path) ?line)
                       (clojure.string/split ?line #"," 5 :> ?name ?rank ?count ?sex ?year))
        year-and-count-by-name (<- [?name ?count ?year ?name-it-needs-to-be]
                                   (= ?name ?name-it-needs-to-be))]
    (??-
     (list-entry)))
)


(comment
  (??-
   (<- [?name]
       ((lfs-textline file-path) ?line)
       (clojure.string/split ?line #"," 5 :> ?name _ _ _ _)
       (= ?name "Karl")))
)
