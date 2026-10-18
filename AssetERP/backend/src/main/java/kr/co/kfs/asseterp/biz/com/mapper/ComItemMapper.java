package kr.co.kfs.asseterp.biz.com.mapper;

import kr.co.kfs.asseterp.biz.com.dto.Com50ItemRes;
import kr.co.kfs.asseterp.biz.com.dto.Com50ItemSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/com/mapper/com50_item.xml + UpdateDataModel(com50_item) — 종목정보 */
@Mapper
public interface ComItemMapper {
    /** AS-IS selectByTextPaging */
    List<Com50ItemRes> selectByTextPaging(@Param("itemType") String itemType, @Param("searchText") String searchText,
                                          @Param("limit") int limit, @Param("offset") int offset);

    /** AS-IS selectByTextPagingTotal */
    long selectByTextPagingTotal(@Param("itemType") String itemType, @Param("searchText") String searchText);

    Com50ItemRes selectById(@Param("itemId") Long itemId);

    Long selectNextId();

    /** AS-IS checkItemCode: 같은 종목코드의 다른 행 수 */
    int checkItemCode(@Param("itemId") Long itemId, @Param("itemCode") String itemCode);

    int insertItem(@Param("itemId") Long itemId, @Param("req") Com50ItemSaveReq req);

    int updateItem(@Param("req") Com50ItemSaveReq req);

    int deleteItems(@Param("ids") List<Long> ids);
}
