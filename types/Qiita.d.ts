export type QiitaPost = {
  rendered_body: string; // HTML形式の本文
  body: string; // Markdown形式の本文
  coediting: boolean; // この記事が共同更新状態かどうか (Qiita Teamでのみ有効)
  comments_count: number; // この記事へのコメントの数
  created_at: string; // データが作成された日時, Format: date-time
  group?: { // Qiita Teamのグループを表します。オプショナルであることに注意
    id: string;
    name: string;
  };
  id: string; // 記事の一意なID, Pattern: /^[0-9a-f]{20}$/
  likes_count: number; // この記事への「いいね」の数（Qiitaでのみ有効）
  private: boolean; // 限定共有状態かどうかを表すフラグ (Qiita Teamでは無効)
  reactions_count: number; // 絵文字リアクションの数（Qiita Teamでのみ有効）
  stocks_count: number; // この記事がストックされた数
  tags: Array<{ // 記事に付いたタグ一覧
    name: string;
    versions?: string[];
  }>;
  title: string; // 記事のタイトル
  updated_at: string; // データが最後に更新された日時, Format: date-time
  url: string; // 記事のURL
  user: { // Qiita上のユーザーを表します。
    id: string;
    name: string;
    profile_image_url: string;
  };
  page_views_count?: number; // 閲覧数, nullまたはinteger
  team_membership?: { // Qiita Team のチームメンバー情報を表します。オプショナルであることに注意
    name: string;
  };
  organization_url_name?: string; // 記事のOrganization の url_name を表します。nullまたはstring
  slide: boolean; // スライドモードが有効を表すフラグ
};