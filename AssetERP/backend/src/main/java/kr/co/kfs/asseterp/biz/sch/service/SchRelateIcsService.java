package kr.co.kfs.asseterp.biz.sch.service;

import kr.co.kfs.asseterp.biz.sch.dto.Sch05RelateIcsAddReq;
import kr.co.kfs.asseterp.biz.sch.dto.Sch05RelateIcsRes;
import kr.co.kfs.asseterp.biz.sch.mapper.SchRelateIcsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS Sch05_Page_RelateIcs → server/sch/Sch05_RelateIcs.java (selectByInfoId L26 / modelUpdate L40 / delete L68) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchRelateIcsService {

    private final SchRelateIcsMapper mapper;

    /** AS-IS selectByInfoId */
    public List<Sch05RelateIcsRes> search(Long infoId) {
        return mapper.selectByInfoId(infoId);
    }

    /** AS-IS modelUpdate: 고른 (법규, 기한) 쌍마다 새 id로 넣는다 → 넣은 행(요청 순서) */
    @Transactional
    public List<Sch05RelateIcsRes> add(Long infoId, List<Sch05RelateIcsAddReq> items) {
        return items.stream().map(item -> {
            long id = mapper.selectNextId();
            mapper.insert(id, infoId, item.icsClassTreeId(), item.deadlineId());
            return mapper.selectById(id);
        }).toList();
    }

    /** AS-IS delete(UpdateDataModel.deleteModel) → 지운 건수 */
    @Transactional
    public int delete(List<Long> relateIcsIds) {
        return relateIcsIds.stream().mapToInt(mapper::deleteById).sum();
    }
}
